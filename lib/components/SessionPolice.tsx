'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export function SessionPolice() {
  const { user, isLoading } = useUser()
  useEffect(() => {
    if (isLoading) return
    if (!user) redirect('/')
  }, [isLoading, user])

  return null
}
