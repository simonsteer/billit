import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'
import { parseInvoiceNodeStyle } from '@/lib/layouts/utils'
import { View, Text as YogaText } from '@react-pdf/renderer'

export interface TextProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children: string | number
}

export function Text(props: TextProps) {
  const children = props.children + ''
  const style = parseInvoiceNodeStyle(
    { fontSize: 12, lineHeight: 18, ...props.style },
    props.mode
  )

  switch (props.mode) {
    case 'dom':
      return (
        <div style={style}>
          <p className="whitespace-pre-line" style={style}>
            {children}
          </p>
        </div>
      )
    case 'yoga':
      return (
        <View style={style}>
          {children.split('\n').map((line, index) => (
            <View key={index} style={{ minHeight: style.lineHeight }}>
              <YogaText break>{line}</YogaText>
            </View>
          ))}
        </View>
      )
    default:
      return null
  }
}
