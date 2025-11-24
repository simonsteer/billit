import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'
import Decimal from 'decimal.js'
import { InvoiceJson, LineItem, TaxItem } from '@/lib/invoices/types'
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

  if (a.dateIssued !== b.dateIssued) {
    diff.dateIssued = b.dateIssued
  }

  if (a.dateDue !== b.dateDue) {
    diff.dateDue = b.dateDue
  }

  if (a.datePaid !== b.datePaid) {
    diff.datePaid = b.datePaid
  }

  if (a.fromDescription !== b.fromDescription) {
    diff.fromDescription = b.fromDescription
  }

  if (a.toDescription !== b.toDescription) {
    diff.toDescription = b.toDescription
  }

  if (a.invoiceNumber !== b.invoiceNumber) {
    diff.invoiceNumber = b.invoiceNumber
  }

  let lineItemsChanged = a.lineItems.length !== b.lineItems.length
  let li = 0
  while (!lineItemsChanged && li < a.lineItems.length) {
    const item_a = a.lineItems[li]
    const item_b = b.lineItems[li]

    lineItemsChanged =
      item_a.id !== item_b.id ||
      item_a.price !== item_b.price ||
      item_a.quantity !== item_b.quantity ||
      item_a.description !== item_b.description

    li++
  }
  if (lineItemsChanged) {
    diff.lineItems = b.lineItems
  }

  if (a.paymentDescription !== b.paymentDescription) {
    diff.paymentDescription = b.paymentDescription
  }

  let taxesChanged = a.taxItems.length !== b.taxItems.length
  let ti = 0
  while (!taxesChanged && ti < a.taxItems.length) {
    const item_a = a.taxItems[ti]
    const item_b = b.taxItems[ti]

    taxesChanged =
      item_a.amount !== item_b.amount ||
      item_a.id !== item_b.id ||
      item_a.label !== item_b.label

    ti++
  }
  if (taxesChanged) {
    diff.taxItems = b.taxItems
  }

  return diff
}

export const getAnonymousInvoice = (): InvoiceJson => {
  const now = DateTime.now()
  const startOfDay = now.startOf('day')

  return {
    userId: 'anonymous',
    id: nanoid(),
    createdAt: now.toUnixInteger(),
    currency: 'USD',
    dateIssued: startOfDay.toUnixInteger(),
    dateDue: startOfDay.toUnixInteger(),
    datePaid: null,
    fromDescription: DEFAULT_FROM_DESCRIPTION,
    invoiceNumber: 1,
    lineItems: [getDefaultLineItem()],
    paymentDescription: DEFAULT_PAYMENT_DESCRIPTION,
    taxItems: [],
    toDescription: DEFAULT_TO_DESCRIPTION,
    updatedAt: null,
    subtotal: 0,
    total: 0,
  }
}

export const getLineItemCost = (lineItem: LineItem) => {
  const cost = Decimal.mul(lineItem.price, lineItem.quantity).toDecimalPlaces(2)
  return cost
}

export const getLineItemsSubtotal = (lineItems: LineItem[]) =>
  lineItems.reduce(
    (subtotal, lineItem) =>
      Decimal.add(subtotal, getLineItemCost(lineItem)).toNumber(),
    0
  )

export const getInvoiceTotal = (
  lineItemsSubtotal: number,
  taxItems: TaxItem[]
) =>
  taxItems.reduce(
    (acc, n) => Decimal.add(acc, n.cost).toNumber(),
    lineItemsSubtotal
  )

export const getDefaultLineItem = (): LineItem => ({
  description: DEFAULT_LINE_ITEM_DESCRIPTION,
  id: nanoid(),
  quantity: 1,
  price: 0,
})

export function getFakeLineItem(): LineItem {
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

  const dateIssued = faker.date.soon({ refDate: createdAt, days: 5 })

  const dateDue = faker.date.soon({ refDate: dateIssued, days: 15 })

  const datePaid =
    faker.helpers.maybe(() =>
      faker.date.soon({ refDate: dateDue, days: 30 })
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
    userId,
    id: nanoid(),
    toDescription: [faker.company.name(), faker.location.streetAddress()].join(
      '\n'
    ),
    fromDescription: [
      faker.person.fullName(),
      faker.company.name(),
      faker.location.streetAddress(),
    ].join('\n'),
    paymentDescription: [
      faker.finance.accountNumber(),
      faker.location.streetAddress(),
      faker.finance.iban(),
      `\nPayable via PayPal to ${faker.internet.email()}`,
    ].join('\n'),
    createdAt: DateTime.fromJSDate(createdAt).toUnixInteger(),
    updatedAt: updatedAt && DateTime.fromJSDate(updatedAt).toUnixInteger(),
    dateIssued: DateTime.fromJSDate(dateIssued).startOf('day').toUnixInteger(),
    dateDue: DateTime.fromJSDate(dateDue).startOf('day').toUnixInteger(),
    datePaid:
      datePaid && DateTime.fromJSDate(datePaid).startOf('day').toUnixInteger(),
    currency,
    invoiceNumber: faker.helpers.rangeToNumber({ min: 0, max: 500 }),
    lineItems,
    taxItems,
    subtotal,
    total,
  }
}
