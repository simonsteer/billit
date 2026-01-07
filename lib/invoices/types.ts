import { type } from 'arktype'
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype'
import { invoices } from '@/lib/db/schema'
import { getInvoicePresentationData } from '@/lib/invoices/utils'

export const LineItemSchema = type({
  id: 'string',
  description: 'string',
  price: 'number.integer',
  quantity: 'number.integer',
})

export const TaxItemSchema = type({
  id: 'string',
  text: 'string',
  amount: 'number.integer',
  cost: 'number.integer',
  label: 'string | null',
})

export const InvoiceSchema = type({
  ['...']: createSelectSchema(invoices),
  tax_items: TaxItemSchema.array(),
  line_items: LineItemSchema.array(),
})

export const InvoiceInsertSchema = type({
  ['...']: createInsertSchema(invoices),
  tax_items: TaxItemSchema.array(),
  line_items: LineItemSchema.array(),
})

export const InvoiceUpdateSchema = InvoiceSchema.partial()

export type LineItemJson = typeof LineItemSchema.infer

export type TaxItemJson = typeof TaxItemSchema.infer

export type InvoiceJson = typeof invoices.$inferSelect

export type InvoiceRenderData = ReturnType<typeof getInvoicePresentationData>
