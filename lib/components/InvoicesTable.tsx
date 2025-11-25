'use client'

import { useQuery } from '@tanstack/react-query'
import { InvoiceJson } from '@/lib/invoices/types'

export function InvoicesTable({ paid }: { paid: boolean }) {
  const { data, error } = useQuery({
    queryKey: ['invoices_table', { paid }],
    queryFn: async () => {
      const res = await fetch(`/api/invoices`, {
        method: 'POST',
        body: JSON.stringify({ paid }),
      })
      const json = await res.json()
      return json as InvoiceJson[]
    },
  })

  console.log(data, error)

  return null
}
