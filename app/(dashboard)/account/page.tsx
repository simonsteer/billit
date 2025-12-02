import { trpc } from '@/lib/trpc/server'

export default async function Page() {
  const result = await trpc.getBusinessProfile()
  return <pre>{JSON.stringify(result, null, 2)}</pre>
}
