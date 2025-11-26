import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext } from '@/lib/trpc/init'
import { trpcRouter } from '@/lib/trpc/router'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
  })

export { handler as GET, handler as POST }
