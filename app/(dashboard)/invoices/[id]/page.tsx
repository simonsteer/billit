import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { Tabs } from 'radix-ui'
import { Invoice, InvoiceEditorForm } from '@/lib/components'
import { db } from '@/lib/db/client'
import { business_profiles, clients, invoices } from '@/lib/db/schema'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'
import { auth0 } from '@/lib/auth'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const id = (await params).id
  const [{ invoices: invoice, clients: client }] = await db()
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.user_id, session.user.sub)))
    .innerJoin(clients, eq(invoices.client_id, clients.id))

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

  const locale = await inferLocaleFromHeaders()

  return (
    <div className="pt-24 flex flex-col h-full">
      <div className="flex-1 flex flex-col w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-40">
          Invoice #{invoice.invoice_number}
        </h1>
        <Tabs.Root defaultValue="edit" className="flex-1 flex flex-col">
          <Tabs.List className="flex gap-12 border-b border-neutral-300 pb-12">
            <TabTrigger value="edit">Edit</TabTrigger>
            <TabTrigger value="preview">Preview</TabTrigger>
          </Tabs.List>
          <div className="flex-1 flex flex-col relative">
            <Tabs.Content
              value="edit"
              className="absolute inset-0 overflow-y-scroll no-scrollbar pt-24 pb-72"
            >
              <InvoiceEditorForm
                business_profile={business_profile}
                client={client}
                invoice={invoice}
              />
            </Tabs.Content>
            <Tabs.Content
              value="preview"
              className="absolute inset-0 flex items-start justify-center overflow-y-scroll no-scrollbar pt-24 pb-72"
            >
              <Invoice
                mode="dom"
                locale={locale}
                invoice={invoice}
                layout={DEFAULT_LAYOUT}
              />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  )
}

function TabTrigger({
  value,
  children,
}: {
  value: string
  children: ReactNode
}) {
  return (
    <Tabs.Trigger value={value} className="group cursor-pointer">
      <span className="group-data-[state=active]:underline group-hover:underline font-sans">
        {children}
      </span>
    </Tabs.Trigger>
  )
}
