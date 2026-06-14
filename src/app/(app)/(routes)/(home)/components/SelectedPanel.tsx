import Image from 'next/image'
import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = {
  works: Work[]
  selectedWork: Work
  filter?: string | null
  onClose: () => void
  onSelect: (id: string) => void
}

export default function SelectedPanel({
  works,
  selectedWork,
  filter,
  onClose,
  onSelect,
}: Props) {
  return (
    <>
      <div className={styles.strip}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        {works.map(work => {
          const faded = !!filter && work.category !== filter
          return (
            <button
              key={work.id}
              className={`${styles.stripDot} ${faded && styles.isFaded}`}
              onClick={() => onSelect(work.id)}
              aria-label={work.title}
            >
							{/* keep sizes in sync with --dot-size in globals.css */}
              <Image src={work.punchholeUrl} alt={work.title} fill sizes="30px" className={styles.cover} />
            </button>
          )
        })}
      </div>
      <div className={styles.description}>
        <span className={styles.meta}>{selectedWork.medium} · {selectedWork.year}</span>
        <h2 className={styles.title}>{selectedWork.title}</h2>
        {selectedWork.description && <p className={styles.text}>{selectedWork.description}</p>}
      </div>
    </>
  )
}
