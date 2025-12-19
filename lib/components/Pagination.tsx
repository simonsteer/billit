import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

const PEEK_SIZE = 4

export function Pagination({
  currentPage,
  maxPage,
  onClickPage,
  className,
  onClickPrev,
  onClickNext,
}: {
  currentPage: number
  maxPage: number
  onClickPage: (n: number) => void
  className?: string
  onClickPrev(): void
  onClickNext(): void
}) {
  const paginationGroups = getPaginationGroups({ currentPage, maxPage })

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
        {paginationGroups.map((group, index) => (
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

export const getPaginationGroups = ({
  currentPage,
  maxPage,
}: {
  currentPage: number
  maxPage: number
}): number[][] => {
  if (maxPage < PEEK_SIZE * 2 - 2) {
    return [[...Array(maxPage)].map((_, p) => p + 1)]
  }

  if (currentPage < PEEK_SIZE) {
    return [[...Array(PEEK_SIZE)].map((_, i) => i + 1), [maxPage]]
  }

  if (currentPage >= PEEK_SIZE && currentPage <= maxPage - (PEEK_SIZE - 1)) {
    return [[1], [currentPage - 1, currentPage, currentPage + 1], [maxPage]]
  }

  if (currentPage >= maxPage - (PEEK_SIZE + 1)) {
    return [
      [1],
      [...Array(PEEK_SIZE)].map((_, i) => maxPage - PEEK_SIZE + i + 1),
    ]
  }

  return [[...Array(maxPage)].map((_, p) => p + 1)]
}
