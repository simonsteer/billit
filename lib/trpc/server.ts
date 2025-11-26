import 'server-only'

import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { cache } from 'react'
import { createCallerFactory, createTRPCContext } from '@/lib/trpc/init'
import { createQueryClient } from '@/lib/trpc/createQueryClient'
import { trpcRouter } from '@/lib/trpc/router'
import { TRPCRouter } from '@/lib/trpc/types'

export const getQueryClient = cache(createQueryClient)

const caller = createCallerFactory(trpcRouter)(createTRPCContext)

const { trpc, HydrateClient } = createHydrationHelpers<TRPCRouter>(
  caller,
  getQueryClient
)

export { trpc, HydrateClient }
