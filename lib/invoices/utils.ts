import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'
import { Invoice, LineItem } from '@/lib/invoices/types'
import {
  DEFAULT_FROM_DESCRIPTION,
  DEFAULT_LINE_ITEM_DESCRIPTION,
  DEFAULT_PAYMENT_DESCRIPTION,
  DEFAULT_TO_DESCRIPTION,
} from '@/lib/invoices/vars'
import { CURRENCIES } from '@/lib/currency/vars'

export function getInvoiceBreakdown(data: Invoice) {
  const subtotal = Object.values(data.lineItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const taxes = data.taxItems.map(tax => ({
    ...tax,
    cost: subtotal * (tax.amount / 100),
  }))

  const total = subtotal + taxes.reduce((a, t) => a + t.cost, 0)

  return { subtotal, taxes, total }
}

export function getInvoiceDiff(a: Invoice, b: Invoice) {
  const diff: Partial<Invoice> = {}

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

export const getAnonymousInvoice = (): Invoice => {
  const now = DateTime.now()
  const startOfDay = now.startOf('day')

  return {
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

export const getDefaultLineItem = (): LineItem => ({
  description: DEFAULT_LINE_ITEM_DESCRIPTION,
  id: nanoid(),
  quantity: 1,
  price: 0,
})

export function getFakeInvoice(): Invoice {
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

  return {
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
      `Payable via PayPal to ${faker.internet.email()}`,
    ].join('\n'),
    createdAt: createdAt.getUTCSeconds(),
    updatedAt: updatedAt && updatedAt.getUTCSeconds(),
    dateIssued: dateIssued.getUTCSeconds(),
    dateDue: dateDue.getUTCSeconds(),
    datePaid: datePaid && datePaid.getUTCSeconds(),
    currency,
    invoiceNumber: faker.helpers.rangeToNumber({ min: 0, max: 500 }),
    lineItems: [getDefaultLineItem()],
    taxItems: [],
    subtotal: 0,
    total: 0,
  }
}
