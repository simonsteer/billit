'use client'

import { useQuery } from '@tanstack/react-query'
import { getUpcomingDepositsTotalAction } from '@/lib/invoices/actions'
import { Currency } from '@/lib/currency/types'
import { getCurrencyFormatter } from '../currency/utils'

export function UpcomingDepositsTotal({
  currency,
  locale,
}: {
  currency: Currency
  locale: string
}) {
  const { data, error, isPending } = useQuery({
    queryKey: ['upcoming_deposits_total', currency],
    queryFn: async () => await getUpcomingDepositsTotalAction(currency),
  })

  if (!data) return null

  const formatCurrency = getCurrencyFormatter({ currency, locale })

  return <h2>{formatCurrency(data.total)}</h2>
}
