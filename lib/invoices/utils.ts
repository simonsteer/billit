import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import BigNumber from 'bignumber.js'
import { InvoiceJson, LineItemJson, TaxItemJson } from '@/lib/invoices/types'
import { DEFAULT_LINE_ITEM_DESCRIPTION } from '@/lib/invoices/vars'
import { getCurrencyFormatter } from '@/lib/currency/utils'

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

export const getLineItemCost = (lineItem: LineItemJson) =>
  BigNumber(lineItem.price).multipliedBy(lineItem.quantity).toNumber()

export const getLineItemsSubtotal = (lineItems: LineItemJson[]) =>
  lineItems
    .reduce(
      (subtotal, lineItem) => subtotal.plus(getLineItemCost(lineItem)),
      BigNumber(0)
    )
    .toNumber()

export const getInvoiceTotal = (
  lineItemsSubtotal: number,
  taxItems: TaxItemJson[]
) =>
  taxItems
    .reduce(
      (acc, tax) =>
        acc.plus(
          BigNumber(lineItemsSubtotal)
            .multipliedBy(tax.amount)
            .shiftedBy(-2)
            .integerValue()
        ),
      BigNumber(lineItemsSubtotal)
    )
    .toNumber()

export const getDefaultLineItem = (): LineItemJson => ({
  description: DEFAULT_LINE_ITEM_DESCRIPTION,
  id: nanoid(),
  quantity: 1,
  price: 0,
})

export const getInvoiceRenderData = ({
  invoice,
  locale,
}: {
  invoice: InvoiceJson
  locale: string
}) => {
  const {
    business_profile_snapshot,
    client_snapshot,
    currency,
    date_due,
    date_issued,
    invoice_number,
    line_items,
    tax_items,
    subtotal,
    total,
    payment_description,
  } = invoice

  const formatCurrency = getCurrencyFormatter({
    currency,
    locale,
  })

  const from_description = [
    business_profile_snapshot.business_name,
    `${business_profile_snapshot.address_line_1}, ${business_profile_snapshot.address_line_2}`,
    `${business_profile_snapshot.city}, ${business_profile_snapshot.state} ${business_profile_snapshot.zip_code}`,
    business_profile_snapshot.country,
  ].join('\n')

  const to_description = [
    client_snapshot.client_name,
    `${client_snapshot.address_line_1}, ${client_snapshot.address_line_2}`,
    `${client_snapshot.city}, ${client_snapshot.state} ${client_snapshot.zip_code}`,
    client_snapshot.country,
  ].join('\n')

  return {
    invoice_number,
    from_description,
    to_description,
    payment_description,
    date_issued: DateTime.fromSQL(date_issued).toFormat('LLL d, yyyy'),
    date_due: DateTime.fromSQL(date_due).toFormat('LLL d, yyyy'),
    line_items: line_items.map(item => ({
      ...item,
      price: formatCurrency(BigNumber(item.price).shiftedBy(-2).toNumber()),
    })),
    tax_items: tax_items.map(item => ({
      ...item,
      cost: formatCurrency(BigNumber(item.cost).shiftedBy(-2).toNumber()),
    })),
    subtotal: formatCurrency(BigNumber(subtotal).shiftedBy(-2).toNumber()),
    total: formatCurrency(BigNumber(total).shiftedBy(-2).toNumber()),
  }
}
