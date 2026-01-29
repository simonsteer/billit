import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { ClientPreviewCard } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { trpc } from '@/lib/trpc/server'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const business_profile = await trpc.getBusinessProfile()
  if (!business_profile) redirect('/onboarding')

  const locale = await inferLocaleFromHeaders()
  const clients = await trpc.getClients()

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Clients
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-562 mb-40">
          Manage your clients.
        </p>
        <div className="grid grid-cols-3 gap-12">
          {clients.map(client => (
            <ClientPreviewCard
              key={client.id}
              client={client}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
