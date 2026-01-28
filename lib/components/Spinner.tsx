import clsx from 'clsx'
import { CSSProperties } from 'react'

export function Spinner({
  className,
  style,
  size = 24,
}: {
  className?: string
  style?: CSSProperties
  size?: number
}) {
  return (
    <div
      style={{ width: size, height: size, ...style }}
      className={clsx(
        'rounded-full border-2 border-neutral-300 border-r-transparent animate-spin',
        className
      )}
    />
  )
}
