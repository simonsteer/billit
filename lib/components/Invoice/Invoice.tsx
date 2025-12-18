import { LayoutMode, RootLayoutNode } from '@/lib/layouts/types'
import { InvoiceJson } from '@/lib/invoices/types'
import { getInvoiceRenderData } from '@/lib/invoices/utils'
import { LayoutNodeComponent } from './components'

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
