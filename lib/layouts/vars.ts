import { box, field, root, text } from '@/lib/layouts/utils'

export const DEFAULT_LAYOUT = root({
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
            field({ value: 'fromDescription' }),
            field({ value: 'toDescription' }),
          ],
        }),
        box({
          style: { flex: 3 },
          children: [
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Invoice Number:' }),
                field({ style: { flex: 1 }, value: 'invoiceNumber' }),
              ],
            }),
            box({
              style: { flexDirection: 'row' },
              children: [
                text({ style: { flex: 1 }, value: 'Invoice Date:' }),
                field({ style: { flex: 1 }, value: 'dateIssued' }),
              ],
            }),
          ],
        }),
      ],
    }),
    box({
      style: { flexDirection: 'row', gap: 16 },
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
      value: 'lineItems',
      template: box({
        style: { flexDirection: 'row', gap: 16 },
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
      style: { flexDirection: 'row', gap: 16 },
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
              value: 'taxItems',
              template: box({
                style: { flexDirection: 'row' },
                children: [
                  box({
                    style: { flex: 1, flexDirection: 'row' },
                    children: [
                      field({ value: 'label' }),
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
              style: { flexDirection: 'row' },
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
        field({ style: { flex: 4 }, value: 'paymentDescription' }),
        box({ style: { flex: 3 } }),
      ],
    }),
  ],
})
