import { useCallback, useSyncExternalStore } from 'react'

// Payload extracts no dimensions for video uploads, so a rendered <video>
// falls back to the browser's 300x150 default box and shifts layout when
// its metadata arrives. Hidden preloader elements warm the browser cache
// and capture intrinsic dimensions so players can reserve space up front.

type Dims = { width: number; height: number }
type Entry = { el: HTMLVideoElement; dims: Dims | null; listeners: Set<() => void> }

const entries = new Map<string, Entry>()

export function preloadVideo(url: string) {
  if (entries.has(url)) return
  const el = document.createElement('video')
  el.muted = true
  el.preload = 'auto'
  el.src = url
  const entry: Entry = { el, dims: null, listeners: new Set() }
  el.addEventListener(
    'loadedmetadata',
    () => {
      entry.dims = { width: el.videoWidth, height: el.videoHeight }
      entry.listeners.forEach(fn => fn())
    },
    { once: true },
  )
  entries.set(url, entry)
}

// Intrinsic dimensions for a video URL, re-rendering once preload metadata
// arrives. Pass null for non-video assets.
export function useVideoDims(url: string | null): Dims | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!url) return () => {}
      preloadVideo(url)
      const entry = entries.get(url)!
      entry.listeners.add(onChange)
      return () => {
        entry.listeners.delete(onChange)
      }
    },
    [url],
  )

  return useSyncExternalStore(
    subscribe,
    () => (url ? (entries.get(url)?.dims ?? null) : null),
    () => null,
  )
}
