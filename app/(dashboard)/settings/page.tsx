import { eq } from 'drizzle-orm'
import { BusinessProfileForm } from '@/lib/components'
import { auth0 } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { business_profiles } from '@/lib/db/schema'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) return null

  let [business_profile = null] = await db()
    .select()
    .from(business_profiles)
    .where(eq(business_profiles.user_id, session.user.sub))

  if (!business_profile) {
    ;[business_profile] = await db()
      .insert(business_profiles)
      .values({ user_id: session.user.sub })
      .returning()
  }

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Account Settings
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-lg mb-40">
          Your Billit account details. Information regarding your business
          profile, subscriptions plan, etc. can be managed from here.
        </p>
        <h2 className="text-28 leading-40 font-serif text-neutral-800 mb-12">
          Business Profile
        </h2>
        <BusinessProfileForm business_profile={business_profile} />
      </div>
    </div>
  )
}
