'use client'

import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { DateTime } from 'luxon'
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { getCurrencyFormatter } from '@/lib/currency/utils'
import { trpc } from '@/lib/trpc/react'
import { ProcedureInput } from '@/lib/trpc/types'
import { Pagination } from '@/lib/components'

export function InvoicesTable({
  params,
  locale,
  title,
}: {
  params: ProcedureInput<'getInvoices'>
  locale: string
  title: string
}) {
  const [page, setPage] = useState(params.page)
  const { data, error, isPending } = trpc.getInvoices.useQuery(
    {
      ...params,
      page,
    },
    {}
  )

  const [stale, setStale] = useState(data)
  useEffect(() => {
    if (data !== undefined) setStale(data)
  }, [data])

  return (
    <div>
      <div className="flex items-end mb-12 gap-12">
        <h2 className="text-28 leading-40 font-serif text-neutral-800 flex-1">
          {title}
        </h2>
        <MixerHorizontalIcon className="shrink-0 w-18 h-18 text-neutral-400 mb-12" />
      </div>
      <div className="relative rounded-lg bg-neutral-50 border border-neutral-300 h-320 overflow-scroll no-scrollbar shadow-lg shadow-black/5">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-neutral-400 border-r-transparent animate-spin" />
          </div>
        )}
        {!isPending && (!data || error) && (
          <div className="absolute inset-0 p-24 flex items-center justify-center">
            <p className="text-16 leading-24 text-center">
              Something went wrong.
            </p>
          </div>
        )}
        {!isPending && data && data.invoices.length === 0 && (
          <div className="absolute inset-0 p-24 flex items-center justify-center">
            <p className="text-16 leading-24 text-center max-w-200">
              No invoices to show with matching criteria.
            </p>
          </div>
        )}
        {!isPending && data && data.invoices.length > 0 && (
          <ul className="animate-fade-in">
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
            {data.invoices.map(invoice => {
              const formatCurrency = getCurrencyFormatter({
                currency: invoice.currency,
                locale,
              })

              const today = DateTime.now()
              const dateIssued = DateTime.fromSQL(invoice.date_issued)
              const dateDue = DateTime.fromSQL(invoice.date_due)

              const paid = invoice.date_paid !== null
              const overdue = !paid && today > dateDue
              const status = paid ? 'paid' : overdue ? 'overdue' : 'pending'

              return (
                <li key={invoice.id}>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="flex group"
                    data-status={status}
                  >
                    <ColumnCell size="sm">{invoice.invoice_number}</ColumnCell>
                    <ColumnCell size="lg">
                      <span className="block w-215 truncate">
                        {invoice.to_description.split('\n')[0]}
                      </span>
                    </ColumnCell>
                    <ColumnCell size="sm">
                      {dateIssued.toFormat('LLL dd, yyyy')}
                    </ColumnCell>
                    <ColumnCell size="sm">
                      {dateDue.toFormat('LLL dd, yyyy')}
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
                      {formatCurrency(
                        BigNumber(invoice.total).shiftedBy(-2).toNumber()
                      )}
                    </ColumnCell>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="flex items-center justify-center h-48">
        {!!stale && stale.maxPage > 0 && (
          <Pagination
            className="animate-fade-in"
            currentPage={stale.currentPage}
            maxPage={stale.maxPage}
            onClickNext={() => {
              if (page === stale.maxPage) return
              setPage(stale.currentPage + 1)
            }}
            onClickPrev={() => {
              if (page === 1) return
              setPage(stale.currentPage - 1)
            }}
            onClickPage={setPage}
          />
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
        'bg-neutral-50 shrink-0 px-12 pt-8 pb-4 first:border-l-0 border-l border-b border-neutral-300',
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
        'shrink-0 px-12 pt-8 pb-4 first:border-l-0 border-l border-b border-neutral-300',
        'group-data-[status=pending]:bg-sky-50',
        'group-data-[status=paid]:bg-green-50',
        'group-data-[status=overdue]:bg-rose-50',
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
