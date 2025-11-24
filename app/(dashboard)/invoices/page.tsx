import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  return (
    <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-2xl mb-32">
      High-level overview of your billing health. See what payments are expected
      in the near future, amounts that are overdue, historical views of paid
      invoices, etc.
    </p>
  )
}
