import { type, scope } from 'arktype'
import { JsonObject, Merge, KeyAsString } from 'type-fest'
import { ReactNode } from 'react'
import { Styles as YogaStyles } from '@react-pdf/renderer'
import { InvoiceRenderData } from '@/lib/invoices/types'

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
  ['borderWidth?']: 'number.integer >= 0',
  ['borderTopWidth?']: 'number.integer >= 0',
  ['borderRightWidth?']: 'number.integer >= 0',
  ['borderBottomWidth?']: 'number.integer >= 0',
  ['borderLeftWidth?']: 'number.integer >= 0',
  ['borderTopLeftRadius?']: 'number.integer >= 0',
  ['borderTopRightRadius?']: 'number.integer >= 0',
  ['borderBottomRightRadius?']: 'number.integer >= 0',
  ['borderBottomLeftRadius?']: 'number.integer >= 0',
  ['borderColor?']: 'string',
  ['borderTopColor?']: 'string',
  ['borderRightColor?']: 'string',
  ['borderBottomColor?']: 'string',
  ['borderLeftColor?']: 'string',
  ['borderStyle?']: '"dashed" | "dotted" | "solid"',
  ['borderTopStyle?']: '"dashed" | "dotted" | "solid"',
  ['borderRightStyle?']: '"dashed" | "dotted" | "solid"',
  ['borderBottomStyle?']: '"dashed" | "dotted" | "solid"',
  ['borderLeftStyle?']: '"dashed" | "dotted" | "solid"',
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
    value:
      "'invoice_number' | 'from_description' | 'to_description' | 'payment_description' | 'line_items' | 'tax_items' | 'date_due' | 'date_issued' | 'subtotal' | 'total' | 'description' | 'quantity' | 'price' | 'text' | 'amount' | 'cost' | 'label'",
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

export type LayoutFieldComponents = FieldComponents<InvoiceRenderData>

type FieldComponents<D extends JsonObject> = {
  [K in KeyAsString<D>]?: D[K] extends (infer V)[]
    ? V extends JsonObject
      ? FieldComponents<V>
      : (args: { node: FieldLayoutNode; value: V }) => ReactNode
    : D[K] extends JsonObject
    ? FieldComponents<D[K]>
    : (args: { node: FieldLayoutNode; value: D[K] }) => ReactNode
}
