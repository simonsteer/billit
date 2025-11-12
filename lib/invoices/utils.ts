import { Invoice } from '@/lib/invoices/types'

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

  if (a.datePaid !== b.datePaid) {
    diff.datePaid = b.datePaid
  }

  if (a.fromDescription !== b.fromDescription) {
    diff.fromDescription = b.fromDescription
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

  if (a.netD !== b.netD) {
    diff.netD = b.netD
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

  if (a.toDescription !== b.toDescription) {
    diff.toDescription = b.toDescription
  }

  return diff
}
