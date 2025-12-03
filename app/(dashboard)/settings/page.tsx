import { redirect } from 'next/navigation'
import { trpc } from '@/lib/trpc/server'
import { BusinessProfileForm } from '@/lib/components'

export default async function Page() {
  // this proc checks for the existence of a session so we don't have to check for one here
  // if it returns null there was no session and we can redirect safely
  const profile = await trpc.getBusinessProfile()
  if (!profile) redirect('/')

  return <BusinessProfileForm profile={profile} />
}
