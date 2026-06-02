'use client'

import { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'
import { Dotfield, SelectedPanel, WorkPreview } from './components'
import { useFilter, resetFilter } from './components/filterStore'
import type { Work } from './components/types'
import { MOCK_WORKS } from './components/types'
import Split from '@app/components/ui/Split'

function randomPositions(count: number) {
  return Array.from({ length: count }, () => ({
    x: 5 + Math.random() * 85,
    y: 5 + Math.random() * 85,
  }))
}

export default function HomepageBody() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [positions, setPositions] = useState<Array<{ x: number; y: number }> | null>(null)
  const { effective } = useFilter()

  useEffect(() => {
    setPositions(randomPositions(MOCK_WORKS.length))
  }, [])

  useEffect(() => resetFilter, [])

  const selectedWork: Work | null = selected
    ? (MOCK_WORKS.find(w => w.id === selected) ?? null)
    : null

  const activeWork: Work | null = selectedWork
    ?? (hovered ? (MOCK_WORKS.find(w => w.id === hovered) ?? null) : null)

  return (
    <Split
      leftClassName={selected ? styles.leftSelected : undefined}
      left={
        selected && selectedWork ? (
          <SelectedPanel
            works={MOCK_WORKS}
            selectedWork={selectedWork}
            filter={effective}
            onClose={() => { setSelected(null); setHovered(null) }}
            onSelect={setSelected}
          />
        ) : (
          positions && (
            <Dotfield
              works={MOCK_WORKS}
              positions={positions}
              filter={effective}
              onHover={setHovered}
              onSelect={(id) => { setHovered(null); setSelected(id) }}
            />
          )
        )
      }
      right={
        activeWork && (
          <WorkPreview
						key={selected ?? hovered}
						work={activeWork}
					/>
        )
      }
    />
  )
}
