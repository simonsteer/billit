import { LayoutMode, RootLayoutNode } from '@/lib/layouts/types'
import { InvoiceJson } from '@/lib/invoices/types'
import { getInvoicePresentationData } from '@/lib/invoices/utils'
import { PDFRenderer } from '@/lib/components'

export function Invoice({
  invoice,
  layout,
  locale,
  mode,
}: {
  invoice: InvoiceJson
  layout: RootLayoutNode
  locale: string
  mode: LayoutMode
}) {
  return (
    <PDFRenderer
      data={getInvoicePresentationData({ invoice, locale })}
      mode={mode}
      layout={layout}
      className="border border-neutral-200 bg-white w-(--invoice-width) min-h-(--invoice-min-height)"
    />
  )
}
