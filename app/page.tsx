import { auth0 } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth0.getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="w-screen min-h-screen p-24">
      <Link href="/auth/login" className="button login">
        Log In
      </Link>
    </main>
  )
}
