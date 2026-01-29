import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { ClientPreviewCardGrid } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { trpc } from '@/lib/trpc/server'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const business_profile = await trpc.getBusinessProfile()
  if (!business_profile) redirect('/onboarding')

  const params = await searchParams
  let query = params.query
  if (Array.isArray(query)) query = undefined

  const clients = await trpc.getClients({ query })
  const locale = await inferLocaleFromHeaders()

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-40">
          Clients
        </h1>
        <ClientPreviewCardGrid
          clients={clients}
          locale={locale}
          query={query || ''}
        />
      </div>
    </div>
  )
}
