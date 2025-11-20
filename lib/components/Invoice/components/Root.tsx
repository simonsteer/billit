import { LayoutMode, LayoutNodeStyle } from '@/lib/layouts/types'
import { ReactNode } from 'react'

export interface RootProps {
  style: LayoutNodeStyle
  mode: LayoutMode
  children?: ReactNode
}

export function Root({ mode, style, children }: RootProps) {
  return null
}
