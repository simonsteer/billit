import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { YearlyRevenueChart } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { trpc } from '@/lib/trpc/server'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const business_profile = await trpc.getBusinessProfile()
  if (!business_profile) redirect('/onboarding')

  const locale = await inferLocaleFromHeaders()

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Dashboard
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-xl mb-40">
          High-level overview of your billing health. See what payments are
          expected in the near future, amounts that are overdue, historical
          views of paid invoices, etc.
        </p>
        <YearlyRevenueChart locale={locale} />
      </div>
    </div>
  )
}
