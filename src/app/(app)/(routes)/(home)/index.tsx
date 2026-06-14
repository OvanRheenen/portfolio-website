'use client'

import { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'
import { Dotfield, SelectedPanel, WorkPreview, WorkGallery } from './components'
import { useFilter, resetFilter } from './components/filterStore'
import type { Work } from './components/types'
import Split from '@app/components/ui/Split'

function randomPositions(count: number) {
  return Array.from({ length: count }, () => ({
    x: 5 + Math.random() * 85,
    y: 5 + Math.random() * 85,
  }))
}

type Props = { works: Work[] }

export default function HomepageBody({ works }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [positions, setPositions] = useState<Array<{ x: number; y: number }> | null>(null)
  const { effective } = useFilter()

  useEffect(() => {
    // Client-only: randomPositions uses Math.random(), so it must run after mount
    // to avoid a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPositions(randomPositions(works.length))
  }, [works.length])

  useEffect(() => resetFilter, [])

  const selectedWork: Work | null = selected
    ? (works.find(w => w.id === selected) ?? null)
    : null

  const activeWork: Work | null = selectedWork
    ?? (hovered ? (works.find(w => w.id === hovered) ?? null) : null)

  return (
    <Split
      leftClassName={selected ? styles.leftSelected : undefined}
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
