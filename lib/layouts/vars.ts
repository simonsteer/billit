import { box, field, root, text } from '@/lib/layouts/utils'

export const DEFAULT_LAYOUT = root({
  size: 'A4',
  style: {
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    gap: 16,
  },
  children: [
    box({
      style: { flexDirection: 'row', gap: 16 },
      children: [
        box({
          style: { gap: 108, flex: 4 },
          children: [
            field({ value: 'from_description' }),
            box({
              children: [
                text({ value: 'Billed to:' }),
                field({ value: 'to_description' }),
              ],
            }),
          ],
        }),
        box({
          style: { flex: 3 },
          children: [
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Invoice Number:' }),
                field({ style: { flex: 1 }, value: 'invoice_number' }),
              ],
            }),
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Date Issued:' }),
                field({ style: { flex: 1 }, value: 'date_issued' }),
              ],
            }),
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Date Due:' }),
                field({ style: { flex: 1 }, value: 'date_due' }),
              ],
            }),
          ],
        }),
      ],
    }),
    box({
      style: {
        flexDirection: 'row',
        gap: 16,
        borderTopColor: 'black',
        borderTopWidth: 1,
        borderTopStyle: 'dashed',
        paddingTop: 16,
      },
      children: [
        text({ style: { flex: 4 }, value: 'Item' }),
        box({
          style: { flex: 3, flexDirection: 'row' },
          children: [
            text({ style: { flex: 1 }, value: 'Qty' }),
            text({ style: { flex: 1 }, value: 'Unit Price' }),
          ],
        }),
      ],
    }),
    field({
      style: { gap: 16 },
      value: 'line_items',
      template: box({
        style: {
          flexDirection: 'row',
          gap: 16,
        },
        children: [
          field({
            style: { flex: 4 },
            value: 'description',
          }),
          box({
            style: { flex: 3, flexDirection: 'row' },
            children: [
              field({
                style: { flex: 1 },
                value: 'quantity',
              }),
              field({ style: { flex: 1 }, value: 'price' }),
            ],
          }),
        ],
      }),
    }),
    box({
      style: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: 'black',
        borderTopStyle: 'dashed',
      },
      children: [
        box({ style: { flex: 4 } }),
        box({
          style: { flex: 3, gap: 16 },
          children: [
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Subtotal' }),
                field({ style: { flex: 1 }, value: 'subtotal' }),
              ],
            }),
            field({
              style: { gap: 16 },
              value: 'tax_items',
              template: box({
                style: { flexDirection: 'row' },
                children: [
                  box({
                    style: { flex: 1, flexDirection: 'row' },
                    children: [
                      field({ value: 'text' }),
                      text({ value: '(', style: { paddingLeft: 4 } }),
                      field({ value: 'amount' }),
                      text({ value: '%)' }),
                    ],
                  }),
                  field({
                    style: { flex: 1 },
                    value: 'cost',
                  }),
                ],
              }),
            }),
            box({
              style: {
                flexDirection: 'row',
                borderTopColor: 'black',
                borderTopWidth: 1,
                borderTopStyle: 'dashed',
                paddingTop: 16,
              },
              children: [
                text({ style: { flex: 1 }, value: 'Total' }),
                field({ style: { flex: 1 }, value: 'total' }),
              ],
            }),
          ],
        }),
      ],
    }),
    box({ style: { flex: 1, paddingTop: 108 } }),
    box({
      style: {
        flexDirection: 'row',
        gap: 16,
        alignContent: 'flex-end',
      },
      children: [
        field({ style: { flex: 4 }, value: 'payment_description' }),
        box({ style: { flex: 3 } }),
      ],
    }),
  ],
})
