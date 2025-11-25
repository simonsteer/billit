import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { invoices } from '@/lib/db/schema'

export const LineItemSchema = type({
  id: 'string',
  description: 'string',
  price: 'number',
  quantity: 'number',
})

export type LineItemJson = typeof LineItemSchema.infer

export const TaxItemSchema = type({
  id: 'string',
  text: 'string',
  amount: 'number',
  label: 'string | null',
  cost: 'number',
})

export const InvoiceSchema = createInsertSchema(invoices)

export type TaxItemJson = typeof TaxItemSchema.infer

export type InvoiceJson = typeof InvoiceSchema.infer
