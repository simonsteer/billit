import { DateTime } from 'luxon'
import {
  LayoutFieldComponents,
  LayoutMode,
  RootLayoutNode,
} from '@/lib/layouts/types'
import { getCurrencyFormatter } from '@/lib/currency/utils'
import { Invoice as InvoiceJson } from '@/lib/invoices/types'
import { LayoutNodeComponent, Text } from './components'

export function Invoice({
  invoice,
  locale,
  root,
  mode,
}: {
  invoice: InvoiceJson
  locale: string
  root: RootLayoutNode
  mode: LayoutMode
}) {
  const formatCurrency = getCurrencyFormatter({
    currency: invoice.currency,
    locale,
  })

  const components: LayoutFieldComponents = {
    fromDescription: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.fromDescription}
      </Text>
    ),
    toDescription: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.toDescription}
      </Text>
    ),
    paymentDescription: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.paymentDescription}
      </Text>
    ),
    dateIssued: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {DateTime.fromSeconds(invoice.dateIssued).toFormat('LLL d, yyyy')}
      </Text>
    ),
    dateDue: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {DateTime.fromSeconds(invoice.dateIssued).toFormat('LLL d, yyyy')}
      </Text>
    ),
    invoiceNumber: ({ node }) => (
      <Text mode={mode} style={node.style}>
        {invoice.invoiceNumber}
      </Text>
    ),
    lineItems: {
      key: item => item.id,
      components: {
        description: ({ node, itemKey }) => {
          const item = invoice.lineItems.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.description}
            </Text>
          )
        },
        price: ({ node, itemKey }) => {
          const item = invoice.lineItems.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {formatCurrency(item.price)}
            </Text>
          )
        },
        quantity: ({ node, itemKey }) => {
          const item = invoice.lineItems.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.quantity}
            </Text>
          )
        },
      },
    },
    taxItems: {
      key: item => item.id,
      components: {
        label: ({ node, itemKey }) => {
          const item = invoice.taxItems.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.type}
            </Text>
          )
        },
        amount: ({ node, itemKey }) => {
          const item = invoice.taxItems.find(item => item.id === itemKey)!
          return (
            <Text mode={mode} style={node.style}>
              {item.amount}
            </Text>
          )
        },
        cost: ({ node, itemKey }) => {
          const item = invoice.taxItems.find(item => item.id === itemKey)!
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
      node={root}
    />
  )
}
