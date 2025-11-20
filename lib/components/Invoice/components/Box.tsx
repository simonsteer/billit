import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'
import { ReactNode } from 'react'

export interface BoxProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children?: ReactNode
}

export function Box({ mode, style, children }: BoxProps) {
  return null
}
