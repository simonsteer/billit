'use client'

import { useEffect, useRef } from 'react'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { getBusinessProfileDiff } from '@/lib/business_profiles/utils'
import { trpc } from '@/lib/trpc/react'
import { usePartialState } from '@/lib/hooks'

export function useUpdateClient(_client: BusinessProfileJson) {
  const { mutate, isPending } = trpc.updateClient.useMutation()

  const [client, setClient] = usePartialState(_client)
  const cached = useRef(client)

  useEffect(() => {
    const updates = getBusinessProfileDiff(cached.current, client)
    if (Object.keys(updates).length === 0) return

    const timeout = setTimeout(() => mutate({ id: client.id, updates }), 500)
    return () => clearTimeout(timeout)
  }, [client])

  return [client, setClient, isPending] as const
}
