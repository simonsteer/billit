'use client'

import clsx from 'clsx'
import { DateTime } from 'luxon'
import { ReactNode } from 'react'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { getInvoicesAction, GetInvoicesParams } from '@/lib/invoices/actions'
import { getCurrencyFormatter } from '@/lib/currency/utils'

export function InvoicesTable({
  params,
  locale,
  title,
}: {
  params: GetInvoicesParams
  locale: string
  title: string
}) {
  const { data, error, isPending } = useQuery({
    queryKey: ['invoices_table', params],
    queryFn: async () => await getInvoicesAction(params),
  })

  return (
    <div>
      <div className="flex items-center mb-12 gap-12">
        <h2 className="text-28 leading-40 font-serif">{title}</h2>
        <MixerHorizontalIcon className="w-18 h-18 text-neutral-400" />
      </div>
      <div className="relative rounded-lg border border-neutral-200 h-280 overflow-scroll no-scrollbar">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-neutral-400 border-r-transparent animate-spin" />
          </div>
        )}
        {!isPending && (!data || error) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-16 leading-24">Something went wrong.</p>
          </div>
        )}
        {!isPending && data && (
          <ul>
            <li className="sticky top-0 flex bg-neutral-100">
              <ColumnHeading size="sm">Invoice number</ColumnHeading>
              <ColumnHeading size="lg">Billed to</ColumnHeading>
              <ColumnHeading size="sm">Date issued</ColumnHeading>
              <ColumnHeading size="sm">Date due</ColumnHeading>
              <ColumnHeading size="sm">Date paid</ColumnHeading>
              <ColumnHeading size="sm">Currency</ColumnHeading>
              <ColumnHeading size="md" fill>
                Total
              </ColumnHeading>
            </li>
            {data.map(invoice => {
              const formatCurrency = getCurrencyFormatter({
                currency: invoice.currency,
                locale,
              })

              return (
                <li key={invoice.id} className="flex">
                  <ColumnCell size="sm">{invoice.invoice_number}</ColumnCell>
                  <ColumnCell size="lg">
                    <span className="block w-215 truncate">
                      {invoice.to_description.split('\n')[0]}
                    </span>
                  </ColumnCell>
                  <ColumnCell size="sm">
                    {DateTime.fromSQL(invoice.date_issued).toFormat(
                      'LLL dd, yyyy'
                    )}
                  </ColumnCell>
                  <ColumnCell size="sm">
                    {DateTime.fromSQL(invoice.date_due).toFormat(
                      'LLL dd, yyyy'
                    )}
                  </ColumnCell>
                  <ColumnCell size="sm">
                    {invoice.date_paid
                      ? DateTime.fromSQL(invoice.date_paid).toFormat(
                          'LLL dd, yyyy'
                        )
                      : '–––'}
                  </ColumnCell>
                  <ColumnCell size="sm">{invoice.currency}</ColumnCell>
                  <ColumnCell size="md" fill>
                    {formatCurrency(invoice.total)}
                  </ColumnCell>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function ColumnHeading({
  children,
  size,
  className,
  fill,
}: {
  children: ReactNode
  size: 'sm' | 'md' | 'lg'
  className?: string
  fill?: boolean
}) {
  return (
    <span
      className={clsx(
        'font-serif text-14 leading-20',
        'bg-neutral-100 shrink-0 px-12 pt-8 pb-4 first:border-l-0 border-l border-b border-neutral-200',
        {
          ['min-w-120']: size === 'sm',
          ['min-w-180']: size === 'md',
          ['min-w-240']: size === 'lg',
          ['flex-1']: fill,
        },
        className
      )}
    >
      {children}
    </span>
  )
}

function ColumnCell({
  children,
  size,
  className,
  fill,
}: {
  children: ReactNode
  size: 'sm' | 'md' | 'lg'
  className?: string
  fill?: boolean
}) {
  return (
    <span
      className={clsx(
        'font-mono text-12 leading-18',
        'shrink-0 px-12 pt-8 pb-4 first:border-l-0 border-l border-b border-neutral-200',
        {
          ['min-w-120']: size === 'sm',
          ['min-w-180']: size === 'md',
          ['min-w-240']: size === 'lg',
          ['flex-1']: fill,
        },
        className
      )}
    >
      {children}
    </span>
  )
}
