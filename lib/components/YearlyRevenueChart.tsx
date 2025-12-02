'use client'

import { Fragment, useId } from 'react'
import { DateTime } from 'luxon'
import { trpc } from '@/lib/trpc/react'
import { ProcedureOutput } from '@/lib/trpc/types'
import { Spinner } from '@/lib/components'
import { getCurrencyFormatter } from '@/lib/currency/utils'

export function YearlyRevenueChart() {
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
      <div className="p-12 rounded-lg bg-neutral-50 border border-neutral-300 shadow-lg shadow-black/5">
        {data ? (
          <RevenueChart data={data} />
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
const CHART_WIDTH = 520
const CHART_HEIGHT = 260
const CHART_X = VIEWPORT_WIDTH - CHART_WIDTH
const CHART_Y = 15

function RevenueChart({
  data,
}: {
  data: NonNullable<ProcedureOutput<'getLast12MonthsRevenue'>>
}) {
  const gradientId = useId()
  const maskId = useId()

  const maxValue = Math.max(...data.map(d => d.total_usd)) * 1.1
  const columnPadding = 0.15
  const columnWidth = CHART_WIDTH / data.length
  const barWidth = columnWidth * (1 - columnPadding * 2)

  const formatCurrency = getCurrencyFormatter({
    currency: 'USD',
    locale: 'en-US',
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWPORT_WIDTH} ${VIEWPORT_HEIGHT}`}
      className="animate-fade-in overflow-visible"
    >
      {[...Array(6)]
        .map((_, index) => index / 6)
        .concat(1)
        .map((progress, index) => {
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
                x={CHART_X - 12}
                y={CHART_Y + progress * CHART_HEIGHT + 3.5}
                className="text-10 font-mono"
                fill="var(--color-neutral-500)"
                textAnchor="end"
              >
                {formatCurrency((6 - index) * 10000)}
              </text>
            </Fragment>
          )
        })}
      {data.map(({ month }, index) => (
        <text
          key={month}
          x={CHART_X + columnWidth / 2 + columnWidth * index}
          y={CHART_Y + CHART_HEIGHT + 20}
          className="text-10 font-mono"
          fill="var(--color-neutral-500)"
          textAnchor="middle"
        >
          {DateTime.fromSQL(month).toFormat('LLL')}
        </text>
      ))}
      <rect
        x={CHART_X}
        y={CHART_Y}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x={CHART_X}
          y={CHART_Y}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          gradientTransform="rotate(90)"
        >
          <stop offset={0} stopColor="var(--color-emerald-300)" />
          <stop offset={CHART_HEIGHT} stopColor="var(--color-lime-100)" />
        </linearGradient>
        <mask id={maskId}>
          {data.map(({ month, total_usd }, index) => {
            const columnStart = CHART_X + (index / data.length) * CHART_WIDTH
            const height = CHART_HEIGHT * (total_usd / maxValue)
            const left = columnStart + columnWidth * columnPadding
            const top = CHART_Y + CHART_HEIGHT - height

            return (
              <rect
                key={month}
                x={left}
                y={top}
                width={barWidth}
                height={height}
                transform="scale(1,0)"
                rx={3}
                ry={3}
                fill="white"
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
        </mask>
      </defs>
    </svg>
  )
}
