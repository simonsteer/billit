import clsx from 'clsx'
import { CSSProperties } from 'react'

export function Spinner({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      style={style}
      className={clsx(
        'w-24 h-24 rounded-full border-3 border-neutral-300 border-r-transparent animate-spin',
        className
      )}
    />
  )
}
