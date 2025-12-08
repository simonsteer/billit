'use client'

import { useEffect, useRef } from 'react'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { getBusinessProfileDiff } from '@/lib/business_profiles/utils'
import { trpc } from '@/lib/trpc/react'
import { usePartialState } from '@/lib/hooks'

export function useUpdateBusinessProfile(_profile: BusinessProfileJson) {
  const { mutate, isPending } = trpc.updateBusinessProfile.useMutation()

  const [profile, setProfile] = usePartialState(_profile)
  const cached = useRef(profile)

  useEffect(() => {
    const updates = getBusinessProfileDiff(cached.current, profile)
    if (Object.keys(updates).length === 0) return

    const timeout = setTimeout(() => mutate({ id: profile.id, updates }), 500)
    return () => clearTimeout(timeout)
  }, [profile])

  return [profile, setProfile, isPending] as const
}
