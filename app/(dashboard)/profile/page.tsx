import { BusinessProfileForm } from '@/lib/components'
import { auth0 } from '@/lib/auth'
import { trpc } from '@/lib/trpc/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) return null

  const business_profile = await trpc.getBusinessProfile()
  if (!business_profile) redirect('/onboarding')

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Business Profile
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-lg mb-40">
          Information regarding your business profile can be managed from here.
          This information will appear on your invoices and estimates.
        </p>
        <BusinessProfileForm business_profile={business_profile} />
      </div>
    </div>
  )
}
