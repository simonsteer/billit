'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons'
import { ProcedureOutput } from '@/lib/trpc/types'
import { ClientPreviewCard } from '@/lib/components'

export function ClientPreviewCardGrid({
  clients,
  query,
  locale,
}: {
  clients: ProcedureOutput<'getClients'>
  query: string
  locale: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(query)

  useEffect(() => setValue(query), [query])

  useEffect(() => {
    const nextQuery = value.trim()
    if (nextQuery === query) return

    const timeout = setTimeout(() => {
      if (!nextQuery) router.push(`/clients`)
      router.push(`/clients?query=${nextQuery}`)
    }, 300)
    return () => clearTimeout(timeout)
  }, [value, query])

  if (!query && clients.length === 0) {
    return (
      <p className="text-16 leading-24 font-sans text-neutral-800">
        You have no clients. Why not{' '}
        <button className="underline cursor-pointer">create one?</button>
      </p>
    )
  }

  let children: ReactNode = null
  if (clients.length === 0) {
    children = (
      <p className="text-16 leading-24 font-sans text-neutral-800">
        {`No clients found matching "${query}"`}
      </p>
    )
  } else {
    children = (
      <div className="grid grid-cols-3 gap-12">
        {clients.map(client => (
          <ClientPreviewCard key={client.id} client={client} locale={locale} />
        ))}
        <button className="flex items-center justify-center rounded-sm border border-neutral-300 h-140 cursor-pointer">
          <PlusIcon className="w-24 h-24 text-neutral-400" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center border border-neutral-200 rounded-full max-w-320 mb-24">
        <div className="h-30 w-30 ml-2 flex items-center justify-center">
          <MagnifyingGlassIcon className="text-neutral-500" />
        </div>
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="bg-transparent pr-12 py-6 w-full text-12 leading-18 outline-none"
        />
      </div>
      {children}
    </div>
  )
}
