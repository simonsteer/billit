import { JsonObject } from 'type-fest'
import { LayoutMode, RootLayoutNode } from '@/lib/layouts/types'
import { LayoutNodeComponent } from './components'

export function PDFRenderer({
  data,
  layout,
  mode,
  className,
}: {
  data: JsonObject
  layout: RootLayoutNode
  mode: LayoutMode
  className?: string
}) {
  return (
    <LayoutNodeComponent
      data={data}
      mode={mode}
      node={layout}
      className={className}
    />
  )
}
