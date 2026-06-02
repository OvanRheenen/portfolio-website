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
	onSelect
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
              style={{ backgroundColor: work.color }}
              onClick={() => onSelect(work.id)}
              aria-label={work.title}
            />
          )
        })}
      </div>
      <div className={styles.description}>
        <span className={styles.meta}>{selectedWork.type} · {selectedWork.year}</span>
        <h2 className={styles.title}>{selectedWork.title}</h2>
        <p className={styles.text}>{selectedWork.description}</p>
      </div>
    </>
  )
}