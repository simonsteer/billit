import { config } from 'dotenv'
import { nanoid } from 'nanoid'
import { DateTime } from 'luxon'
import BigNumber from 'bignumber.js'
import { faker } from '@faker-js/faker'
import { db } from '@/lib/db/client'
import { business_profiles, clients, invoices } from '@/lib/db/schema'
import { convertCurrency, updateConversionRates } from '@/lib/currency/utils'
import { InvoiceJson, LineItemJson, TaxItemJson } from '@/lib/invoices/types'
import { FinancialExchangeRates } from '@/lib/currency/types'
import { CURRENCIES } from '@/lib/currency/vars'
import { getInvoiceTotal, getLineItemsSubtotal } from '@/lib/invoices/utils'
import { ClientJson } from '@/lib/clients/types'
import { BusinessProfileJson } from '@/lib/business_profiles/types'

config({ path: '.env' })

function getFakeData<T>(n: number, cb: (userId: string) => T) {
  return process.env
    .ADMIN_USER_IDS!.split(',')
    .flatMap(userId => [...Array(n)].map(() => cb(userId)))
}

function getFakeBusinessProfile({
  userId,
}: {
  userId: string
}): BusinessProfileJson {
  const createdAt = faker.date.past({ years: 2 })

  const updatedAt =
    faker.helpers.maybe(() =>
      faker.date.recent({ refDate: createdAt, days: 30 })
    ) || null

  return {
    id: nanoid(),
    user_id: userId,
    business_name: faker.company.name(),
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    email: faker.internet.email(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    created_at: DateTime.fromJSDate(createdAt).toSQL()!,
    updated_at: updatedAt && DateTime.fromJSDate(updatedAt).toSQL(),
  }
}

function getFakeClient({ userId }: { userId: string }): ClientJson {
  const createdAt = faker.date.past({ years: 2 })

  const updatedAt =
    faker.helpers.maybe(() =>
      faker.date.recent({ refDate: createdAt, days: 30 })
    ) || null

  return {
    id: nanoid(),
    user_id: userId,
    client_name: faker.company.name(),
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    email: faker.internet.email(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    created_at: DateTime.fromJSDate(createdAt).toSQL()!,
    updated_at: updatedAt && DateTime.fromJSDate(updatedAt).toSQL(),
  }
}

function getFakeInvoice({
  userId,
  client,
  business_profile,
  fx,
}: {
  userId: string
  client: ClientJson
  business_profile: BusinessProfileJson
  fx: FinancialExchangeRates
}): InvoiceJson {
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
  ].map(
    (): LineItemJson => ({
      id: nanoid(),
      description: faker.commerce.productName(),
      price: faker.number.int({
        min: 100,
        max: 50000,
        multipleOf: 5,
      }),
      quantity: faker.number.int({ min: 1, max: 10 }),
    })
  )

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
    id: nanoid(),
    user_id: userId,
    client_id: client.id,
    client_snapshot: client,
    business_profile_snapshot: business_profile,
    to_description: [
      client.client_name,
      `${client.address_line_1}, ${client.address_line_2}`,
      `${client.city}, ${client.state} ${client.zip_code}`,
      client.country,
    ].join('\n'),
    from_description: [
      business_profile.business_name,
      `${business_profile.address_line_1}, ${business_profile.address_line_2}`,
      `${business_profile.city}, ${business_profile.state} ${business_profile.zip_code}`,
      business_profile.country,
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

  // empty tables
  // invoices must be deleted first to not violate fk_constraint on clients table
  await db().delete(invoices)
  await db().delete(clients)
  await db().delete(business_profiles)

  // recreate fake business profiles in development database
  const fakeBusinessProfiles = getFakeData(1, userId =>
    getFakeBusinessProfile({ userId })
  )
  await db().insert(business_profiles).values(fakeBusinessProfiles)

  // recreate fake clients in development database
  const fakeClients = getFakeData(8, userId => getFakeClient({ userId }))
  await db().insert(clients).values(fakeClients)

  // recreate fake invoices in development database
  const fakeInvoices = getFakeData(500, userId => {
    const userClients = fakeClients.filter(client => client.user_id === userId)
    const userBusinessProfile = fakeBusinessProfiles.find(
      profile => profile.user_id === userId
    )!

    return getFakeInvoice({
      userId,
      fx,
      client: userClients[Math.floor(Math.random() * userClients.length)],
      business_profile: userBusinessProfile,
    })
  })
  await db().insert(invoices).values(fakeInvoices)
}

main()
