import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'
import Decimal from 'decimal.js'
import { InvoiceJson, LineItemJson, TaxItemJson } from '@/lib/invoices/types'
import {
  DEFAULT_FROM_DESCRIPTION,
  DEFAULT_LINE_ITEM_DESCRIPTION,
  DEFAULT_PAYMENT_DESCRIPTION,
  DEFAULT_TO_DESCRIPTION,
} from '@/lib/invoices/vars'
import { CURRENCIES } from '@/lib/currency/vars'

export function getInvoiceDiff(a: InvoiceJson, b: InvoiceJson) {
  const diff: Partial<InvoiceJson> = {}

  if (a.currency !== b.currency) {
    diff.currency = b.currency
  }

  if (a.date_issued !== b.date_issued) {
    diff.date_issued = b.date_issued
  }

  if (a.date_due !== b.date_due) {
    diff.date_due = b.date_due
  }

  if (a.date_paid !== b.date_paid) {
    diff.date_paid = b.date_paid
  }

  if (a.from_description !== b.from_description) {
    diff.from_description = b.from_description
  }

  if (a.to_description !== b.to_description) {
    diff.to_description = b.to_description
  }

  if (a.invoice_number !== b.invoice_number) {
    diff.invoice_number = b.invoice_number
  }

  let lineItemsChanged = a.line_items.length !== b.line_items.length
  let li = 0
  while (!lineItemsChanged && li < a.line_items.length) {
    const item_a = a.line_items[li]
    const item_b = b.line_items[li]

    lineItemsChanged =
      item_a.id !== item_b.id ||
      item_a.price !== item_b.price ||
      item_a.quantity !== item_b.quantity ||
      item_a.description !== item_b.description

    li++
  }
  if (lineItemsChanged) {
    diff.line_items = b.line_items
  }

  if (a.payment_description !== b.payment_description) {
    diff.payment_description = b.payment_description
  }

  let taxesChanged = a.tax_items.length !== b.tax_items.length
  let ti = 0
  while (!taxesChanged && ti < a.tax_items.length) {
    const item_a = a.tax_items[ti]
    const item_b = b.tax_items[ti]

    taxesChanged =
      item_a.amount !== item_b.amount ||
      item_a.id !== item_b.id ||
      item_a.label !== item_b.label

    ti++
  }
  if (taxesChanged) {
    diff.tax_items = b.tax_items
  }

  return diff
}

export const getAnonymousInvoice = (): InvoiceJson => {
  const now = DateTime.now()
  const startOfDay = now.startOf('day')

  return {
    user_id: 'anonymous',
    id: nanoid(),
    created_at: now.toSQLDate(),
    currency: 'USD',
    date_issued: startOfDay.toSQLDate(),
    date_due: startOfDay.toSQLDate(),
    date_paid: null,
    from_description: DEFAULT_FROM_DESCRIPTION,
    invoice_number: 1,
    line_items: [getDefaultLineItem()],
    payment_description: DEFAULT_PAYMENT_DESCRIPTION,
    tax_items: [],
    to_description: DEFAULT_TO_DESCRIPTION,
    updated_at: null,
    subtotal: 0,
    total: 0,
  }
}

export const getLineItemCost = (lineItem: LineItemJson) => {
  const cost = Decimal.mul(lineItem.price, lineItem.quantity).toDecimalPlaces(2)
  return cost
}

export const getLineItemsSubtotal = (lineItems: LineItemJson[]) =>
  lineItems.reduce(
    (subtotal, lineItem) =>
      Decimal.add(subtotal, getLineItemCost(lineItem)).toNumber(),
    0
  )

export const getInvoiceTotal = (
  lineItemsSubtotal: number,
  taxItems: TaxItemJson[]
) =>
  taxItems.reduce(
    (acc, n) => Decimal.add(acc, n.cost).toNumber(),
    lineItemsSubtotal
  )

export const getDefaultLineItem = (): LineItemJson => ({
  description: DEFAULT_LINE_ITEM_DESCRIPTION,
  id: nanoid(),
  quantity: 1,
  price: 0,
})

export function getFakeLineItem(): LineItemJson {
  return {
    id: nanoid(),
    description: faker.commerce.productName(),
    price: faker.number.float({
      min: 5,
      max: 500,
      multipleOf: 0.05,
    }),
    quantity: faker.number.int({ min: 1, max: 10 }),
  }
}

export function getFakeInvoice(userId: string): InvoiceJson {
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

  const lineItems = [...Array(faker.number.int({ min: 1, max: 4 }))].map(
    getFakeLineItem
  )

  const subtotal = getLineItemsSubtotal(lineItems)

  const taxItems = [
    {
      id: nanoid(),
      amount: 0.13,
      text: 'HST',
      cost: Decimal.mul(subtotal, 0.13).toDecimalPlaces(2).toNumber(),
      label: null,
    },
  ]

  const total = getInvoiceTotal(subtotal, taxItems)

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
    invoice_number: faker.helpers.rangeToNumber({ min: 0, max: 500 }),
    line_items: lineItems,
    tax_items: taxItems,
    subtotal,
    total,
  }
}
