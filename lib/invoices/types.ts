import { type } from 'arktype'
import { CurrencySchema } from '@/lib/currency/types'
import { getInvoiceBreakdown } from '@/lib/invoices/utils'

export const LineItemSchema = type({
  id: 'string',
  description: 'string',
  price: 'number',
  quantity: 'number',
})

export type LineItem = typeof LineItemSchema.infer

export const TaxItemSchema = type({
  id: 'string',
  type: 'string',
  amount: 'number',
  label: 'string',
  cost: 'number',
})

export type TaxItem = typeof TaxItemSchema.infer

export const InvoiceSchema = type({
  id: 'string',
  clientName: 'string',
  fromDescription: 'string',
  toDescription: 'string',
  paymentDescription: 'string',
  lineItems: LineItemSchema.array(),
  taxItems: TaxItemSchema.array(),
  currency: CurrencySchema,
  invoiceNumber: 'number >= 0',
  dateIssued: 'number.epoch',
  datePaid: 'number.epoch',
  dateDue: 'number.epoch',
  subtotal: 'number',
  total: 'number',
})

export type Invoice = typeof InvoiceSchema.infer
