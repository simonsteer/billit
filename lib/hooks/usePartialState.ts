'use client'

import { useState } from 'react'

export function usePartialState<T>(initial: T) {
  const [state, _setState] = useState(initial)

  function setState(updates: Partial<T>) {
    _setState({ ...state, ...updates })
  }

  return [state, setState] as const
}
