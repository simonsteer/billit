'use client'

import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { trpc } from '@/lib/trpc/react'
import { ProcedureOutput } from '@/lib/trpc/types'
import { Spinner } from '@/lib/components'
import { getCurrencyFormatter } from '@/lib/currency/utils'

export function ClientPreviewCard({
  client,
  locale,
}: {
  client: ProcedureOutput<'getClients'>[number]
  locale: string
}) {
  const { data, isPending } = trpc.getOutstandingClientBalance.useQuery({
    id: client.id,
  })

  const formatCurrency = getCurrencyFormatter({ locale, currency: 'USD' })

  return (
    <Link
      href={`/clients/${client.id}`}
      className="flex flex-col justify-between rounded-sm border border-neutral-300 h-140 p-12"
    >
      <p className="text-14 leading-20 font-semibold font-sans">
        {client.client_name}
      </p>
      <div>
        <p className="text-12 leading-18 mb-4 font-sans">
          {client.invoices_count} invoices
        </p>
        <div className="flex items-end">
          {isPending ? (
            <Spinner size={14} className="mt-4" />
          ) : (
            typeof data === 'number' && (
              <p className="text-12 leading-18 font-sans">
                {formatCurrency(BigNumber(data).shiftedBy(-2).toNumber())}{' '}
                outstanding
              </p>
            )
          )}
        </div>
      </div>
    </Link>
  )
}
