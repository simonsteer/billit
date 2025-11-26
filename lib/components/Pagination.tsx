import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

export function Pagination({
  currentPage,
  maxPage,
  onClickPage,
  className,
  onClickPrev,
  onClickNext,
  peekSize = 4,
}: {
  peekSize?: number
  currentPage: number
  maxPage: number
  onClickPage: (n: number) => void
  className?: string
  onClickPrev(): void
  onClickNext(): void
}) {
  const numberGroups = getNumberGroups({ currentPage, maxPage, peekSize })

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <button
        className="cursor-pointer"
        onClick={e => {
          e.preventDefault()
          onClickPrev()
        }}
      >
        <ChevronLeftIcon />
      </button>
      <ul className="mx-12 flex items-center justify-center font-sans text-14 leading-20">
        {numberGroups.map((group, index) => (
          <li className="flex" key={index}>
            {index > 0 && <div className="mx-12">...</div>}
            <div className="flex">
              {group.map((page, index) => {
                const isActivePage = page === currentPage
                return (
                  <button
                    key={index}
                    onClick={e => {
                      e.preventDefault()
                      onClickPage(page)
                    }}
                    className={clsx(
                      index > 0 && 'ml-8',
                      isActivePage
                        ? 'cursor-auto'
                        : 'cursor-pointer opacity-50 hover:opacity-100'
                    )}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
      <button
        className="cursor-pointer"
        onClick={e => {
          e.preventDefault()
          onClickNext()
        }}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}

const getNumberGroups = ({
  currentPage,
  maxPage,
  peekSize,
}: {
  currentPage: number
  maxPage: number
  peekSize: number
}): number[][] => {
  if (maxPage < peekSize * 2 - 2) {
    return [[...Array(maxPage)].map((_, p) => p + 1)]
  }

  if (currentPage < peekSize) {
    return [[...Array(peekSize)].map((_, i) => i + 1), [maxPage]]
  }

  if (currentPage >= peekSize && currentPage <= maxPage - (peekSize - 1)) {
    return [[1], [currentPage - 1, currentPage, currentPage + 1], [maxPage]]
  }

  if (currentPage >= maxPage - (peekSize + 1)) {
    return [[1], [...Array(peekSize)].map((_, i) => maxPage - peekSize + i + 1)]
  }

  return [[...Array(maxPage)].map((_, p) => p + 1)]
}
