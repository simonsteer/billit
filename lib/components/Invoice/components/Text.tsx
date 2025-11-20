import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'

export interface TextProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children: string | number
}

export function Text({ children, mode, style }: TextProps) {
  return null
}
