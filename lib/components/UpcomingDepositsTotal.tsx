'use client'

import { Currency } from '@/lib/currency/types'
import { getCurrencyFormatter } from '@/lib/currency/utils'
import { trpc } from '@/lib/trpc/react'

export function UpcomingDepositsTotal({
  currency,
  locale,
}: {
  currency: Currency
  locale: string
}) {
  const { data } = trpc.getUpcomingDepositsTotal.useQuery({
    currency,
  })

  if (!data) return null

  const formatCurrency = getCurrencyFormatter({ currency, locale })

  return <h2>{formatCurrency(data.total)}</h2>
}
