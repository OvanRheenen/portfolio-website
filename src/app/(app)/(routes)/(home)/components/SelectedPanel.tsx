import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = {
  works: Work[]
  selectedWork: Work
  onClose: () => void
  onSelect: (id: string) => void
}

export default function SelectedPanel({ 
	works,
	selectedWork,
	onClose,
	onSelect
}: Props) {
  return (
    <>
      <div className={styles.strip}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        {works.map(work => (
          <button
            key={work.id}
            className={`${styles.stripDot}`}
            style={{ backgroundColor: work.color }}
            onClick={() => onSelect(work.id)}
            aria-label={work.title}
          />
        ))}
      </div>
      <div className={styles.description}>
        <span className={styles.meta}>{selectedWork.category} · {selectedWork.year}</span>
        <h2 className={styles.title}>{selectedWork.title}</h2>
        <p className={styles.text}>{selectedWork.description}</p>
      </div>
    </>
  )
}