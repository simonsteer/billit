import {
  BoxLayoutNode,
  DOMCompatibleYogaStyle,
  FieldLayoutNode,
  ImageLayoutNode,
  LayoutMode,
  LayoutNodeStyle,
  RootLayoutNode,
  TextLayoutNode,
} from '@/lib/layouts/types'
import { nanoid } from 'nanoid'
import { SetRequired } from 'type-fest'

export function parseInvoiceNodeStyle(
  _style: LayoutNodeStyle,
  layoutMode: LayoutMode
): DOMCompatibleYogaStyle {
  const style: DOMCompatibleYogaStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    position: 'relative',
    flexShrink: 0,
  }

  for (const key in _style) {
    const value = _style[key as keyof LayoutNodeStyle]
    if (typeof value === 'number' && key !== 'flex') {
      style[key as keyof LayoutNodeStyle] = parseNumericInvoiceNodeStyle(
        value,
        layoutMode
      ) as never
    } else {
      style[key as keyof LayoutNodeStyle] = value as never
    }
  }

  return style
}

export function parseNumericInvoiceNodeStyle(
  value: number,
  layoutMode: LayoutMode
) {
  return layoutMode === 'dom'
    ? `calc(var(--invoice-unit) * ${value})`
    : `${value}pt`
}

export const root = (
  { style = {}, children = [], size } = {} as SetRequired<
    Partial<Pick<RootLayoutNode, 'style' | 'children' | 'size'>>,
    'size'
  >
): RootLayoutNode => ({
  type: 'root',
  id: nanoid(),
  style,
  children,
  size,
})

export const box = (
  { style = {}, children = [] } = {} as Partial<
    Pick<RootLayoutNode, 'style' | 'children'>
  >
): BoxLayoutNode => ({
  type: 'box',
  id: nanoid(),
  style,
  children,
})

export const text = (
  { style = {}, value = '' } = {} as Partial<
    Pick<TextLayoutNode, 'style' | 'value'>
  >
): TextLayoutNode => ({
  type: 'text',
  id: nanoid(),
  style,
  value,
})

export const image = (
  { style = {}, src = '' } = {} as Partial<
    Pick<ImageLayoutNode, 'style' | 'src'>
  >
): ImageLayoutNode => ({
  type: 'image',
  id: nanoid(),
  style,
  src,
})

export const field = (
  { style = {}, value = 'from_description', template = null } = {} as Partial<
    Pick<FieldLayoutNode, 'style' | 'value' | 'template'>
  >
): FieldLayoutNode => ({
  type: 'field',
  id: nanoid(),
  style,
  value,
  template,
})
