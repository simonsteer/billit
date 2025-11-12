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
