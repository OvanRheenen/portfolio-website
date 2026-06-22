'use client'

import { useEffect, useState } from 'react'
import { BP_MD } from '@app/lib/breakpoints'

// Subscribes to a CSS media query. Returns `null` until mounted so SSR and the
// first client render agree (matchMedia is unavailable on the server); callers
// gate on the null state.
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}

// Tracks whether the viewport is at/below the mobile breakpoint.
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BP_MD}px)`)
}
