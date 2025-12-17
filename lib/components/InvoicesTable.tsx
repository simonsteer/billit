'use client'

import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { DateTime } from 'luxon'
import { ReactNode, useEffect, useState } from 'react'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { getCurrencyFormatter } from '@/lib/currency/utils'
import { trpc } from '@/lib/trpc/react'
import { ProcedureInput, ProcedureOutput } from '@/lib/trpc/types'
import { Pagination, Spinner } from '@/lib/components'

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
      <div className="relative rounded-lg bg-white border border-neutral-300 h-360 overflow-scroll no-scrollbar">
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
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
          <TableContents data={data} locale={locale} />
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

function TableContents({
  data,
  locale,
}: {
  data: ProcedureOutput<'getInvoices'>
  locale: string
}) {
  return (
    <table className="animate-fade-in min-w-full">
      <thead>
        <tr>
          <TableHeading>Invoice number</TableHeading>
          <TableHeading>Client</TableHeading>
          <TableHeading>Date issued</TableHeading>
          <TableHeading>Date due</TableHeading>
          <TableHeading>Date paid</TableHeading>
          <TableHeading>Currency</TableHeading>
          <TableHeading>Total</TableHeading>
        </tr>
      </thead>
      <tbody>
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
            <tr key={invoice.id}>
              <TableData>{invoice.invoice_number}</TableData>
              <TableData className="max-w-200 truncate">
                {invoice.to_description.split('\n')[0]}
              </TableData>
              <TableData>{dateIssued.toFormat('LLL dd, yyyy')}</TableData>
              <TableData>{dateDue.toFormat('LLL dd, yyyy')}</TableData>
              <TableData>
                {invoice.date_paid
                  ? DateTime.fromSQL(invoice.date_paid).toFormat('LLL dd, yyyy')
                  : '–––'}
              </TableData>
              <TableData>{invoice.currency}</TableData>
              <TableData>
                {formatCurrency(
                  BigNumber(invoice.total).shiftedBy(-2).toNumber()
                )}
              </TableData>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function TableHeading({ children }: { children: ReactNode }) {
  return (
    <th
      className={clsx(
        'relative sticky top-0 whitespace-nowrap font-medium font-serif text-14 leading-20 px-12 py-6 text-left bg-white',
        'border-x first:border-l-0 last:border-r-0 border-neutral-300',
        'after:absolute after:inset-x-0 after:top-full after:h-px after:bg-neutral-300'
      )}
      scope="col"
    >
      {children}
    </th>
  )
}

function TableData({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td
      className={clsx(
        'border border-neutral-300 first:border-l-0 last:border-r-0 font-mono text-12 leading-18 px-12 py-6 truncate',
        className
      )}
    >
      {children}
    </td>
  )
}
