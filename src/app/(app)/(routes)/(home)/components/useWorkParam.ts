'use client'

import { useCallback, useEffect, useState } from 'react'

// Reflects the `?work=<id>` query param as the source of truth for which work
// is open. Reads/writes via the History API in client-only effects so the home
// page stays fully client-rendered (no useSearchParams Suspense boundary) and
// matches the page's existing deferred-paint pattern. Does not validate ids —
// callers check the value against their own works list.
export function useWorkParam(): readonly [string | null, (id: string | null) => void] {
  const [work, setWorkState] = useState<string | null>(null)

  useEffect(() => {
    const read = () => setWorkState(new URLSearchParams(window.location.search).get('work'))
    read() // initial value, client-only to avoid a hydration mismatch
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const setWork = useCallback((id: string | null) => {
    const url = id ? `?work=${encodeURIComponent(id)}` : window.location.pathname
    window.history.pushState({}, '', url)
    setWorkState(id)
  }, [])

  return [work, setWork] as const
}
