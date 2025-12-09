'use client'

import { InvoiceJson } from '@/lib/invoices/types'
import { ClientJson } from '@/lib/clients/types'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { TextInput } from '@/lib/components'
import { usePartialState } from '@/lib/hooks'

export function InvoiceEditorForm({
  invoice: _invoice,
}: {
  invoice: InvoiceJson
}) {
  return (
    <div>
      <form></form>
    </div>
  )
}
