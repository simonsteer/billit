import { LayoutMode, RootLayoutNode } from '@/lib/layouts/types'
import { InvoiceJson } from '@/lib/invoices/types'
import { LayoutNodeComponent } from './components'
import { getInvoiceRenderData } from '@/lib/invoices/utils'

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
    <LayoutNodeComponent
      data={getInvoiceRenderData({ invoice, locale })}
      mode={mode}
      node={layout}
    />
  )
}
