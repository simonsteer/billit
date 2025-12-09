import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { Spinner } from '@/lib/components'
import { trpc } from '@/lib/trpc/server'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const business_profile = await trpc.getBusinessProfile()
  if (!business_profile) redirect('/onboarding')

  return <Spinner />
}
