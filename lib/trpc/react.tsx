'use client'

import { PropsWithChildren, useState } from 'react'
import superjson from 'superjson'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { createQueryClient } from '@/lib/trpc/createQueryClient'
import type { TRPCRouter } from '@/lib/trpc/types'

export const trpc = createTRPCReact<TRPCRouter>()

let clientQueryClientSingleton: QueryClient
function getQueryClient() {
  // For server create new client
  if (typeof window === 'undefined') return createQueryClient()
  return (clientQueryClientSingleton ??= createQueryClient())
}

function getUrl() {
  // need to change for deploy url
  return 'http://localhost:3000/api/trpc'
}

export function TRPCProvider(props: PropsWithChildren) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: getUrl(),
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
