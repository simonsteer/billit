import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import { and, eq, max, inArray, desc } from 'drizzle-orm'
import Decimal from 'decimal.js'
import { invoices } from '@/lib/db/schema'
import { db } from '@/lib/db/client'
import {
  DEFAULT_FROM_DESCRIPTION,
  DEFAULT_PAYMENT_DESCRIPTION,
  DEFAULT_TO_DESCRIPTION,
} from '@/lib/invoices/vars'
import {
  getDefaultLineItem,
  getInvoiceTotal,
  getLineItemsSubtotal,
} from '@/lib/invoices/utils'
import { TaxItemJson } from '@/lib/invoices/types'

export class UserInvoicesService {
  private userId: string

  private belongsToUser = (invoiceIds?: string[] | string) =>
    typeof invoiceIds === 'undefined'
      ? eq(invoices.user_id, this.userId)
      : and(
          eq(invoices.user_id, this.userId),
          inArray(
            invoices.id,
            typeof invoiceIds === 'string' ? [invoiceIds] : invoiceIds
          )
        )

  constructor(userId: string) {
    this.userId = userId
  }

  async getNextInvoiceNumber() {
    const [highest_numbered] = await db
      .select({ invoice_number: max(invoices.invoice_number) })
      .from(invoices)
      .where(this.belongsToUser())
      .limit(1)

    return (highest_numbered?.invoice_number || 0) + 1
  }

  async create() {
    const [last_created] = await db
      .select({
        to_description: invoices.to_description,
        from_description: invoices.from_description,
        payment_description: invoices.payment_description,
        tax_items: invoices.tax_items,
        currency: invoices.currency,
        date_due: invoices.date_due,
        date_issued: invoices.date_issued,
      })
      .from(invoices)
      .where(eq(invoices.user_id, this.userId))
      .orderBy(desc(invoices.created_at))
      .limit(1)

    const invoice_number = await this.getNextInvoiceNumber()

    const line_items = [getDefaultLineItem()]

    const subtotal = getLineItemsSubtotal(line_items)

    const tax_items = (last_created?.tax_items || []).map(
      (taxItem): TaxItemJson => {
        const id = nanoid()
        return {
          id,
          amount: taxItem.amount,
          text: taxItem.text,
          cost: Decimal.mul(subtotal, taxItem.amount)
            .toDecimalPlaces(2)
            .toNumber(),
          label: taxItem.label,
        }
      }
    )

    const total = getInvoiceTotal(subtotal, tax_items)

    const date_issued = DateTime.now().setZone('America/New_York').toSQLDate()!

    const date_due = last_created?.date_due || date_issued

    const [result = null] = await db
      .insert(invoices)
      .values({
        user_id: this.userId,
        invoice_number,
        date_issued,
        date_due,
        date_paid: null,
        from_description:
          last_created?.from_description || DEFAULT_FROM_DESCRIPTION,
        to_description: last_created?.to_description || DEFAULT_TO_DESCRIPTION,
        payment_description:
          last_created?.payment_description || DEFAULT_PAYMENT_DESCRIPTION,
        line_items,
        tax_items,
        currency: last_created?.currency || 'USD',
        subtotal,
        total,
      })
      .returning()

    return result
  }
}
