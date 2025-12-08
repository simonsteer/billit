import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'
import { parseInvoiceNodeStyle } from '@/lib/layouts/utils'
import { Document, Page } from '@react-pdf/renderer'
import { ReactNode } from 'react'

export interface RootProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children?: ReactNode
}

export function Root(props: RootProps) {
  const style = parseInvoiceNodeStyle(props.style, props.mode)

  switch (props.mode) {
    case 'dom':
      return (
        <div
          className="border border-neutral-200 bg-white w-(--invoice-width) min-h-(--invoice-min-height)"
          style={style}
        >
          {props.children}
        </div>
      )
    case 'yoga':
      return (
        <Document>
          <Page size="A4" style={style}>
            {props.children}
          </Page>
        </Document>
      )
    default:
      return null
  }
}
