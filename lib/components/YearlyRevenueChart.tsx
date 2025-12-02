'use client'

import { DateTime } from 'luxon'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { trpc } from '@/lib/trpc/react'
import { ProcedureOutput } from '@/lib/trpc/types'
import { Spinner } from '@/lib/components'

export function YearlyRevenueChart() {
  const { data, isPending } = trpc.getStuff.useQuery()

  return (
    <div className="p-12 rounded-lg bg-neutral-50 border border-neutral-300 shadow-lg shadow-black/5">
      {isPending && (
        <div className="w-full aspect-[6/4] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isPending && !data && (
        <div className="w-full aspect-[6/4] flex items-center justify-center">
          <p className="text-16 leading-24 text-center">
            Something went wrong.
          </p>
        </div>
      )}
      {!isPending && data && <RevenueChart data={data} />}
    </div>
  )
}

function RevenueChart({
  data,
}: {
  data: NonNullable<ProcedureOutput<'getStuff'>>
}) {
  const gradientId = useId()
  const maskId = useId()

  const maxValue = Math.max(...data.map(d => d.total_usd))
  const columnPadding = 0.1
  const columnWidth = 600 / data.length
  const barWidth = columnWidth * (1 - columnPadding * 2)

  const [lineLength, setLineLength] = useState(0)
  const ref = useRef<SVGPathElement>(null)
  useEffect(() => {
    if (!ref.current) return
    setLineLength(ref.current.getTotalLength())
  }, [])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 400"
      className="animate-fade-in overflow-visible"
    >
      <rect
        x={0}
        y={0}
        width={600}
        height={400}
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />
      {[...Array(12)].map((_, index) => {
        if (index === 0) return null

        const progress = index / 12
        return (
          <Fragment key={`line-${index}`}>
            <line
              x1={0}
              y1={progress * 400}
              x2={600}
              y2={progress * 400}
              strokeWidth={0.75}
              strokeDasharray="3"
              stroke="var(--color-neutral-300)"
            />
            <line
              x1={progress * 600}
              y1={0}
              x2={progress * 600}
              y2={400}
              strokeWidth={0.75}
              strokeDasharray="3"
              stroke="var(--color-neutral-300)"
            />
          </Fragment>
        )
      })}
      {data.map(({ month }, index) => {
        const columnStart = (index / data.length) * 600
        const left = columnStart + columnWidth * columnPadding + barWidth / 2
        const top = 400 - columnWidth * columnPadding * 2
        const date = DateTime.fromSQL(month).toFormat('LLL')

        return (
          <text
            key={month}
            x={left}
            y={top}
            opacity={0}
            textAnchor="middle"
            className="text-14 leading-20 font-sans text-neutral-800"
          >
            {date}
            <animate
              attributeName="opacity"
              fill="freeze"
              values="0;1"
              keySplines="0.1 0.75 0.25 1"
              keyTimes="0;1"
              calcMode="spline"
              dur="1s"
              begin={index * 0.025 + 's'}
            />
          </text>
        )
      })}
      <defs>
        <linearGradient
          id={gradientId}
          x={0}
          y={0}
          width={600}
          height={400}
          gradientTransform="rotate(90)"
        >
          <stop offset={0} stopColor="var(--color-emerald-300)" />
          <stop offset={400} stopColor="var(--color-lime-100)" />
        </linearGradient>
        <mask id={maskId}>
          {data.map(({ month, total_usd }, index) => {
            const columnStart = (index / data.length) * 600
            const height = 400 * (total_usd / maxValue)
            const left = columnStart + columnWidth * columnPadding
            const top = 400 - height

            return (
              <rect
                key={month}
                x={left}
                y={top}
                width={barWidth}
                rx={3}
                ry={3}
                fill="white"
              >
                <animate
                  attributeName="height"
                  values={`0;${height}`}
                  keySplines="0.1 0.75 0.25 1"
                  keyTimes="0;1"
                  calcMode="spline"
                  dur="0.5s"
                  begin={index * 0.025 + 's'}
                  fill="freeze"
                />
                <animate
                  attributeName="y"
                  values={`400;${top}`}
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
