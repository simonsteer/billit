import { config } from 'dotenv'
import { nanoid } from 'nanoid'
import { DateTime } from 'luxon'
import BigNumber from 'bignumber.js'
import { faker } from '@faker-js/faker'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { convertCurrency, updateConversionRates } from '@/lib/currency/utils'
import { InvoiceJson, LineItemJson, TaxItemJson } from '@/lib/invoices/types'
import { FinancialExchangeRates } from '@/lib/currency/types'
import { CURRENCIES } from '@/lib/currency/vars'
import { getInvoiceTotal, getLineItemsSubtotal } from '@/lib/invoices/utils'

config({ path: '.env' })

function getFakeLineItem(): LineItemJson {
  return {
    id: nanoid(),
    description: faker.commerce.productName(),
    price: faker.number.int({
      min: 100,
      max: 50000,
      multipleOf: 5,
    }),
    quantity: faker.number.int({ min: 1, max: 10 }),
  }
}

function getFakeInvoice(
  userId: string,
  fx: FinancialExchangeRates
): InvoiceJson {
  const createdAt = faker.date.past({ years: 2 })

  const updatedAt =
    faker.helpers.maybe(() =>
      faker.date.recent({ refDate: createdAt, days: 30 })
    ) || null

  const date_issued = faker.date.soon({ refDate: createdAt, days: 5 })

  const date_due = faker.date.soon({ refDate: date_issued, days: 15 })

  const date_paid =
    faker.helpers.maybe(() =>
      faker.date.soon({ refDate: date_due, days: 30 })
    ) || null

  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]

  const lineItems: LineItemJson[] = [
    ...Array(faker.number.int({ min: 1, max: 4 })),
  ].map(getFakeLineItem)

  const subtotal = getLineItemsSubtotal(lineItems)

  const taxItems: TaxItemJson[] = [
    {
      id: nanoid(),
      amount: 13,
      cost: BigNumber(subtotal)
        .multipliedBy(13)
        .shiftedBy(-2)
        .integerValue()
        .toNumber(),
      text: 'HST',
      label: null,
    },
  ]

  const total = getInvoiceTotal(subtotal, taxItems)

  const total_usd = convertCurrency(total, currency, 'USD', fx)

  return {
    user_id: userId,
    id: nanoid(),
    to_description: [faker.company.name(), faker.location.streetAddress()].join(
      '\n'
    ),
    from_description: [
      faker.person.fullName(),
      faker.company.name(),
      faker.location.streetAddress(),
    ].join('\n'),
    payment_description: [
      faker.finance.accountNumber(),
      faker.location.streetAddress(),
      faker.finance.iban(),
      `\nPayable via PayPal to ${faker.internet.email()}`,
    ].join('\n'),
    created_at: DateTime.fromJSDate(createdAt).toSQL()!,
    updated_at: updatedAt && DateTime.fromJSDate(updatedAt).toSQL(),
    date_issued: DateTime.fromJSDate(date_issued).startOf('day').toSQLDate()!,
    date_due: DateTime.fromJSDate(date_due).startOf('day').toSQLDate()!,
    date_paid:
      date_paid && DateTime.fromJSDate(date_paid).startOf('day').toSQLDate(),
    currency,
    invoice_number: faker.helpers.rangeToNumber({ min: 0, max: 1000 }),
    line_items: lineItems,
    tax_items: taxItems,
    subtotal,
    total,
    total_usd,
  }
}

async function main() {
  // update currency conversion rates
  const fx = await updateConversionRates()

  // delete invoices from development database
  await db().delete(invoices)

  // bulk insert fake invoices for each admin user
  await db()
    .insert(invoices)
    .values(
      process.env
        .ADMIN_USER_IDS!.split(',')
        .flatMap(userId =>
          [...Array(500)].map(() => getFakeInvoice(userId, fx))
        )
    )
}

main()
