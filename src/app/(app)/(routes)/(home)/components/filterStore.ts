import { useSyncExternalStore } from 'react'

// Shared work-category filter state for the home page.
// The 2D/3D nav lives in the Header (layout) while the dots live in the page
// body; they are siblings with no shared React tree, so this module-level
// store bridges them. `hover` previews a category, `locked` persists it, and
// the effective filter is `hover ?? locked` (preview overrides lock).

type Category = string | null

let hover: Category = null
let locked: Category = null

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function setHover(cat: Category) {
  if (hover === cat) return
  hover = cat
  emit()
}

export function toggleLock(cat: string) {
  locked = locked === cat ? null : cat
  emit()
}

export function resetFilter() {
  if (hover === null && locked === null) return
  hover = null
  locked = null
  emit()
}

function getEffective(): Category {
  return hover ?? locked
}

type Snapshot = { hover: Category; locked: Category; effective: Category }

// Server snapshot: no filter active during SSR.
const serverSnapshot: Snapshot = { hover: null, locked: null, effective: null }

let snapshot: Snapshot = { hover, locked, effective: getEffective() }

function getSnapshot() {
  // Recompute only when something changed, to keep a stable reference.
  if (snapshot.hover !== hover || snapshot.locked !== locked) {
    snapshot = { hover, locked, effective: getEffective() }
  }
  return snapshot
}

export function useFilter() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
}
