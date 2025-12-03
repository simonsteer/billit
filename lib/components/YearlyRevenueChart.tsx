'use client'

import BigNumber from 'bignumber.js'
import { Fragment } from 'react'
import { DateTime } from 'luxon'
import { trpc } from '@/lib/trpc/react'
import { ProcedureOutput } from '@/lib/trpc/types'
import { Spinner } from '@/lib/components'
import { getCurrencyFormatter } from '@/lib/currency/utils'

export function YearlyRevenueChart({ locale }: { locale: string }) {
  const { data, isPending } = trpc.getLast12MonthsRevenue.useQuery()

  const end = DateTime.now().toFormat('LLL yyyy')
  const start = DateTime.now()
    .minus({ years: 1 })
    .plus({ months: 1 })
    .toFormat('LLL yyyy')

  return (
    <div>
      <h2 className="text-28 leading-40 font-serif text-neutral-800 mb-12">
        Revenue {start} – {end}
      </h2>
      <div className="p-12 rounded-lg border border-neutral-300">
        {data ? (
          <RevenueChart data={data} locale={locale} />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{ aspectRatio: VIEWPORT_WIDTH / VIEWPORT_HEIGHT }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="text-16 leading-24 text-center">
                Something went wrong.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const VIEWPORT_WIDTH = 600
const VIEWPORT_HEIGHT = 300
const CHART_HEIGHT = 265
const CHART_Y = 10

function RevenueChart({
  data,
  locale,
}: {
  data: NonNullable<ProcedureOutput<'getLast12MonthsRevenue'>>
  locale: string
}) {
  const maxValue = Math.max(...data.map(d => d.total_usd))
  const maxDigits = maxValue.toString().length
  const increment = BigNumber(0.1).shiftedBy(maxDigits).toNumber() / 2
  const numIncrements = Math.ceil(maxValue / increment)
  const chartMax = numIncrements * increment

  const formatCurrency = getCurrencyFormatter({
    currency: 'USD',
    locale,
  })

  const increments = [...Array(numIncrements)]
    .map((_, index) => index / numIncrements)
    .concat(1)
    .map((progress, index) => {
      const formatted = formatCurrency(
        BigNumber((numIncrements - index) * increment)
          .shiftedBy(-2)
          .toNumber()
      )
      return { progress, formatted, width: formatted.length * 6 }
    })

  const CHART_X = Math.max(...increments.map(i => i.width)) + 12
  const CHART_WIDTH = VIEWPORT_WIDTH - CHART_X

  const columnPadding = 0.15
  const columnWidth = CHART_WIDTH / data.length
  const barWidth = columnWidth * (1 - columnPadding * 2)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWPORT_WIDTH} ${VIEWPORT_HEIGHT}`}
      className="animate-fade-in overflow-visible"
    >
      {increments.map(({ progress, formatted, width }, index) => {
        return (
          <Fragment key={`value-line-${index}`}>
            <line
              x1={CHART_X}
              y1={CHART_Y + progress * CHART_HEIGHT}
              x2={CHART_X + CHART_WIDTH}
              y2={CHART_Y + progress * CHART_HEIGHT}
              strokeWidth={1}
              strokeDasharray="3"
              stroke="var(--color-neutral-300)"
            />
            <text
              x={CHART_X - 10}
              y={CHART_Y + progress * CHART_HEIGHT + 3.5}
              className="text-10 leading-14 font-mono"
              textLength={width}
              fill="var(--color-neutral-500)"
              textAnchor="end"
            >
              {formatted}
            </text>
          </Fragment>
        )
      })}
      {data.map(({ month }, index) => (
        <text
          key={`text-${month}`}
          x={CHART_X + columnWidth / 2 + columnWidth * index}
          y={CHART_Y + CHART_HEIGHT + 20}
          className="text-10 leading-14 font-mono"
          fill="var(--color-neutral-500)"
          textAnchor="middle"
        >
          {DateTime.fromSQL(month).toFormat('LLL')}
        </text>
      ))}
      {data.map(({ month, total_usd }, index) => {
        const columnStart = CHART_X + (index / data.length) * CHART_WIDTH
        const height = CHART_HEIGHT * (total_usd / chartMax)
        const left = columnStart + columnWidth * columnPadding
        const top = CHART_Y + CHART_HEIGHT - height

        return (
          <rect
            key={`bar-${month}`}
            x={left}
            y={top}
            width={barWidth}
            height={height}
            transform="scale(1,0)"
            rx={3}
            ry={3}
            fill="var(--color-neutral-300)"
            style={{ transformOrigin: 'bottom' }}
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values={`1 0;1 1`}
              keySplines="0.1 0.75 0.25 1"
              keyTimes="0;1"
              calcMode="spline"
              dur="0.5s"
              begin={index * 0.025 + 's'}
              fill="freeze"
            />
          </rect>
        )
      })}
    </svg>
  )
}
