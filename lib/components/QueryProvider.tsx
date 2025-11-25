'use client'

import { ReactNode, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = useRef(new QueryClient()).current
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
