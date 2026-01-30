import {
  LayoutMode,
  LayoutNodeStyle,
  StandardPageSize,
} from '@/lib/layouts/types'
import { parseInvoiceNodeStyle } from '@/lib/layouts/utils'
import { Document, Page } from '@react-pdf/renderer'
import { ReactNode } from 'react'

export interface RootProps {
  style: LayoutNodeStyle
  className?: string
  mode: LayoutMode
  children?: ReactNode
  size: StandardPageSize
}

export function Root(props: RootProps) {
  const style = parseInvoiceNodeStyle(props.style, props.mode)

  switch (props.mode) {
    case 'dom':
      return (
        <div className={props.className} style={style}>
          {props.children}
        </div>
      )
    case 'yoga':
      return (
        <Document>
          <Page size={props.size} style={style}>
            {props.children}
          </Page>
        </Document>
      )
    default:
      return null
  }
}
