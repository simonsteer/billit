'use client'

import BigNumber from 'bignumber.js'
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
      <div
        className="p-12 rounded-lg border border-neutral-300"
        style={{ aspectRatio: VIEWPORT_WIDTH / VIEWPORT_HEIGHT }}
      >
        {data ? (
          data.length > 0 ? (
            <RevenueChart data={data} locale={locale} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-16 leading-24 text-center">
                No revenue data available for this time period.
              </p>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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

function RevenueChart({
  data,
  locale,
}: {
  data: NonNullable<ProcedureOutput<'getLast12MonthsRevenue'>>
  locale: string
}) {
  const formatCurrency = getCurrencyFormatter({
    currency: 'USD',
    locale,
  })

  const maxValue = Math.max(...data.map(d => d.total_usd))
  const yAxis = computeYAxis(maxValue, formatCurrency)
  const yAxisWidth = Math.max(...yAxis.map(y => y.width))
  const chartMax = Math.max(...yAxis.map(i => i.value))

  const columnPadding = 0.2
  const columnWidth = VIEWPORT_WIDTH / data.length
  const barWidth = columnWidth * (1 - columnPadding * 2)

  return (
    <div>
      <div className="flex gap-12">
        <div
          className="flex flex-col justify-between shrink-0"
          style={{ width: yAxisWidth }}
        >
          {yAxis.map(y => (
            <p
              className="text-12 leading-18 text-neutral-800 font-mono"
              key={y.formatted}
            >
              {y.formatted}
            </p>
          ))}
        </div>
        <div className="flex-1 py-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${VIEWPORT_WIDTH} ${VIEWPORT_HEIGHT}`}
            className="animate-fade-in overflow-visible h-full w-full"
            preserveAspectRatio="none"
          >
            {yAxis.map(({ progress }, index) => (
              <line
                key={`value-line-${index}`}
                x1={0}
                y1={progress * VIEWPORT_HEIGHT}
                x2={VIEWPORT_WIDTH}
                y2={progress * VIEWPORT_HEIGHT}
                strokeWidth={1}
                strokeDasharray="3"
                stroke="var(--color-neutral-300)"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {data.map(({ month, total_usd }, index) => {
              const columnStart = (index / data.length) * VIEWPORT_WIDTH
              const height = VIEWPORT_HEIGHT * (total_usd / chartMax)
              const left = columnStart + columnWidth * columnPadding
              const top = VIEWPORT_HEIGHT - height

              return (
                <rect
                  key={`bar-${month}`}
                  x={left}
                  y={top}
                  width={barWidth}
                  height={height + 0.5}
                  transform="scale(1,0)"
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
        </div>
      </div>
      <div
        style={{ marginLeft: yAxisWidth + 12 }}
        className="flex justify-around items-center mt-2"
      >
        {data.map(d => (
          <p
            key={d.month}
            className="text-12 leading-18 font-mono text-neutral-800"
          >
            {DateTime.fromSQL(d.month).toFormat('LLL')}
          </p>
        ))}
      </div>
    </div>
  )
}

function computeYAxis(
  maxValue: number,
  formatCurrency: (value: number) => string
) {
  const raw = maxValue / 5
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const normalized = raw / magnitude

  const step =
    (() => {
      if (normalized <= 1) return 1
      if (normalized <= 2) return 2
      if (normalized <= 2.5) return 2.5
      if (normalized <= 5) return 5
      return 10
    })() * magnitude

  const max = Math.ceil(maxValue / step) * step

  const ticks = Array.from(
    { length: Math.floor(max / step) + 1 },
    (_, i) => i * step
  )

  const values = ticks.map((value, index) => {
    const formatted = formatCurrency(BigNumber(value).shiftedBy(-2).toNumber())
    return {
      value,
      progress: 1 - index / (ticks.length - 1),
      formatted,
      width: formatted.length * 7.2,
    }
  })

  return values.toReversed()
}
