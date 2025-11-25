import { DateTime } from 'luxon'
import {
  LayoutFieldComponents,
  LayoutMode,
  RootLayoutNode,
} from '@/lib/layouts/types'
import { getCurrencyFormatter } from '@/lib/currency/utils'
import { InvoiceJson } from '@/lib/invoices/types'
import { LayoutNodeComponent, Text } from './components'

export function Invoice({
  invoice,
  layout,
  locale,
  mode,
}: {
  invoice: InvoiceJson
  layout: RootLayoutNode
  locale: string
  mode: LayoutMode
}) {
  const formatCurrency = getCurrencyFormatter({
    currency: invoice.currency,
    locale,
  })

  const components: LayoutFieldComponents = {
    from_description: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.from_description}
      </Text>
    ),
    to_description: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.to_description}
      </Text>
    ),
    payment_description: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.payment_description}
      </Text>
    ),
    date_issued: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {DateTime.fromSQL(invoice.date_issued).toFormat('LLL d, yyyy')}
      </Text>
    ),
    date_due: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {DateTime.fromSQL(invoice.date_due).toFormat('LLL d, yyyy')}
      </Text>
    ),
    invoice_number: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.invoice_number}
      </Text>
    ),
    line_items: {
      key: item => item.id,
      components: {
        description: ({ node, itemKey }) => {
          const item = invoice.line_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.description}
            </Text>
          )
        },
        price: ({ node, itemKey }) => {
          const item = invoice.line_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {formatCurrency(item.price)}
            </Text>
          )
        },
        quantity: ({ node, itemKey }) => {
          const item = invoice.line_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.quantity}
            </Text>
          )
        },
      },
    },
    tax_items: {
      key: item => item.id,
      components: {
        label: ({ node, itemKey }) => {
          const item = invoice.tax_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.text}
            </Text>
          )
        },
        amount: ({ node, itemKey }) => {
          const item = invoice.tax_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.amount}
            </Text>
          )
        },
        cost: ({ node, itemKey }) => {
          const item = invoice.tax_items.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {formatCurrency(item.cost)}
            </Text>
          )
        },
      },
    },
    subtotal: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {formatCurrency(invoice.subtotal)}
      </Text>
    ),
    total: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {formatCurrency(invoice.total)}
      </Text>
    ),
  }

  return (
    <LayoutNodeComponent
      components={components}
      data={invoice}
      mode={mode}
      node={layout}
    />
  )
}
