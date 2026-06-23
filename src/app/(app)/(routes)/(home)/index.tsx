'use client'

import { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'
import { Dotfield, SelectedPanel, WorkPreview, WorkGallery, MobileHome } from './components'
import { useFilter, resetFilter } from './components/filterStore'
import { useWorkParam } from './components/useWorkParam'
import type { Work } from './components/types'
import Split from '@app/components/ui/Split'
import { useIsMobile } from '@app/components/hooks/useMediaQuery'

function randomPositions(count: number) {
  return Array.from({ length: count }, () => ({
    x: 5 + Math.random() * 85,
    y: 5 + Math.random() * 85,
  }))
}

type Props = { works: Work[] }

export default function HomepageBody({ works }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useWorkParam()
  const [positions, setPositions] = useState<Array<{ x: number; y: number }> | null>(null)
  const { effective } = useFilter()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Client-only: randomPositions uses Math.random(), so it must run after mount
    // to avoid a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(randomPositions(works.length))
    // Header title click re-scatters the dotfield without a reload.
    const reshuffle = () => setPositions(randomPositions(works.length))
    window.addEventListener('reshuffle', reshuffle)
    return () => window.removeEventListener('reshuffle', reshuffle)
  }, [works.length])

  useEffect(() => resetFilter, [])

  const selectedWork: Work | null = selected
    ? (works.find(w => w.id === selected) ?? null)
    : null

  const activeWork: Work | null = selectedWork
    ?? (hovered ? (works.find(w => w.id === hovered) ?? null) : null)

  // null until mounted (matchMedia is client-only) — render nothing to keep
  // SSR and first client render in sync, matching the dotfield's deferred paint.
  if (isMobile === null) return null
  if (isMobile) return <MobileHome works={works} />

  return (
    <Split
      leftClassName={selectedWork ? styles.leftSelected : undefined}
      left={
        selected && selectedWork ? (
          <SelectedPanel
            works={works}
            selectedWork={selectedWork}
            filter={effective}
            onClose={() => { setSelected(null); setHovered(null) }}
            onSelect={setSelected}
          />
        ) : (
          positions && (
            <Dotfield
              works={works}
              positions={positions}
              filter={effective}
              onHover={setHovered}
              onSelect={(id) => { setHovered(null); setSelected(id) }}
            />
          )
        )
      }
      right={
        selected && selectedWork && selectedWork.projectImages.length > 0 ? (
          <WorkGallery key={selected} work={selectedWork} />
        ) : (
          activeWork && (
            <WorkPreview
              key={selected ?? hovered}
              work={activeWork}
            />
          )
        )
      }
    />
  )
}
