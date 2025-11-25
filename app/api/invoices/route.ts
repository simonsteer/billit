import { and, eq, isNotNull, isNull } from 'drizzle-orm'
import { auth0 } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'

export async function POST(request: Request) {
  const session = await auth0.getSession()
  if (!session) return Response.json([])

  const body: { paid: boolean } = await request.json()

  return Response.json(
    await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.user_id, session.user.sub),
          body.paid ? isNotNull(invoices.date_paid) : isNull(invoices.date_paid)
        )
      )
  )
}
