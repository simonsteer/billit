import { type, scope } from 'arktype'
import { Merge } from 'type-fest'
import { Styles as YogaStyles } from '@react-pdf/renderer'
import {
  InvoiceSchema,
  LineItemSchema,
  TaxItemSchema,
} from '@/lib/invoices/types'

export type LayoutMode = 'dom' | 'yoga'

export const LayoutNodeStyleSchema = type({
  ['paddingTop?']: 'number.integer >= 0',
  ['paddingRight?']: 'number.integer >= 0',
  ['paddingBottom?']: 'number.integer >= 0',
  ['paddingLeft?']: 'number.integer >= 0',
  ['gap?']: 'number.integer >= 0',
  ['fontSize?']: 'number.integer >= 0',
  ['fontFamily?']: 'string',
  ['fontWeight?']: 'number.integer >= 0',
  ['lineHeight?']: 'number.integer >= 0',
  ['backgroundColor?']: 'string',
  ['color?']: 'string',
  ['flexDirection?']: '"column" | "row"',
  ['alignContent?']:
    '"flex-start" | "flex-end" | "center" | "stretch" | "baseline"',
  ['justifyContent?']:
    '"flex-start" | "flex-end" | "center" | "space-around" | "space-between" | "space-evenly"',
  ['objectFit?']: '"fill" | "contain" | "cover"',
  ['flex?']: 'number.integer >= 0',
  ['width?']: 'number.integer >= 0',
  ['height?']: 'number.integer >= 0',
})

export type LayoutNodeStyle = typeof LayoutNodeStyleSchema.infer

export type DOMCompatibleYogaStyle = Merge<
  Pick<
    YogaStyles[string],
    | keyof LayoutNodeStyle
    | 'display'
    | 'position'
    | 'flexShrink'
    | 'alignContent'
  >,
  Pick<LayoutNodeStyle, 'fontFamily' | 'objectFit'>
>

export const {
  BoxLayoutNodeSchema,
  FieldLayoutNodeSchema,
  ImageLayoutNodeSchema,
  TextLayoutNodeSchema,
  RootLayoutNodeSchema,
} = scope({
  child:
    'BoxLayoutNodeSchema | FieldLayoutNodeSchema | TextLayoutNodeSchema | ImageLayoutNodeSchema',
  LayoutNodeBaseSchema: { id: 'string', style: LayoutNodeStyleSchema },
  TextLayoutNodeSchema: {
    ['...']: 'LayoutNodeBaseSchema',
    type: '"text"',
    value: 'string',
  },
  FieldLayoutNodeSchema: {
    ['...']: 'LayoutNodeBaseSchema',
    type: '"field"',
    value: InvoiceSchema.keyof()
      .or(LineItemSchema.keyof())
      .or(TaxItemSchema.keyof()),
    template: 'null | child',
  },
  BoxLayoutNodeSchema: {
    ['...']: 'LayoutNodeBaseSchema',
    type: '"box"',
    children: 'child[]',
  },
  ImageLayoutNodeSchema: {
    ['...']: 'LayoutNodeBaseSchema',
    type: '"image"',
    src: 'string',
  },
  RootLayoutNodeSchema: {
    ['...']: 'LayoutNodeBaseSchema',
    type: '"root"',
    children: 'child[]',
  },
}).export()

export type BoxLayoutNode = typeof BoxLayoutNodeSchema.infer

export type TextLayoutNode = typeof TextLayoutNodeSchema.infer

export type FieldLayoutNode = typeof FieldLayoutNodeSchema.infer

export type RootLayoutNode = typeof RootLayoutNodeSchema.infer

export type ImageLayoutNode = typeof ImageLayoutNodeSchema.infer
