import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { trpc } from '@/lib/trpc/server'
import { OnboardingForm } from '@/lib/components/OnboardingForm'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const business_profile = await trpc.getBusinessProfile()
  if (business_profile) redirect('/dashboard')

  return (
    <main className="w-screen min-h-screen p-24 bg-white">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Setup your profile
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-2xl mb-40">
          Enter your business details to be shown on your estimates and
          invoices. We only require your business name; other fields can be left
          blank. This information can be edited later.
        </p>
        <OnboardingForm />
      </div>
    </main>
  )
}
