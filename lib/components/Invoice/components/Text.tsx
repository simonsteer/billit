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
        <p className="whitespace-pre-line" style={style}>
          {children}
        </p>
      )
    case 'yoga':
      return (
        <View style={style}>
          {children.split('\n').map((line, index) => (
            <YogaText key={index} break style={{ minHeight: style.lineHeight }}>
              {line}
            </YogaText>
          ))}
        </View>
      )
    default:
      return null
  }
}
