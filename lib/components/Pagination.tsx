import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

export function Pagination({
  currentPage,
  totalPages,
  onClickPage,
  className,
  onClickPrev,
  onClickNext,
  peekSize = 4,
}: {
  peekSize?: number
  currentPage: number
  totalPages: number
  onClickPage: (n: number) => void
  className?: string
  onClickPrev(): void
  onClickNext(): void
}) {
  const numberGroups = getNumberGroups({ currentPage, totalPages, peekSize })

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
  totalPages,
  peekSize,
}: {
  currentPage: number
  totalPages: number
  peekSize: number
}): number[][] => {
  if (totalPages < peekSize * 2 - 2) {
    return [[...Array(totalPages)].map((_, p) => p + 1)]
  }

  if (currentPage < peekSize) {
    return [[...Array(peekSize)].map((_, i) => i + 1), [totalPages]]
  }

  if (currentPage >= peekSize && currentPage <= totalPages - (peekSize - 1)) {
    return [[1], [currentPage - 1, currentPage, currentPage + 1], [totalPages]]
  }

  if (currentPage >= totalPages - (peekSize + 1)) {
    return [
      [1],
      [...Array(peekSize)].map((_, i) => totalPages - peekSize + i + 1),
    ]
  }

  return [[...Array(totalPages)].map((_, p) => p + 1)]
}
