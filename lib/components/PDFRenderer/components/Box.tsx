import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'
import { parseInvoiceNodeStyle } from '@/lib/layouts/utils'
import { View } from '@react-pdf/renderer'
import { ReactNode } from 'react'

export interface BoxProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children?: ReactNode
}

export function Box(props: BoxProps) {
  const style = parseInvoiceNodeStyle(props.style, props.mode)

  switch (props.mode) {
    case 'dom':
      return <div style={style}>{props.children}</div>
    case 'yoga':
      return (
        <View wrap={false} style={style}>
          {props.children}
        </View>
      )
    default:
      return null
  }
}
