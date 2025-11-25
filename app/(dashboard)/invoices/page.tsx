import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { InvoicesTable } from '@/lib/components'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  return (
    <div>
      <InvoicesTable paid={true} />
      <InvoicesTable paid={false} />
    </div>
  )
}
