import Image from 'next/image'
import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = { work: Work }

export default function WorkPreview({ work }: Props) {
  return (
    <div className={styles.image}>
      <Image
        src={work.previewUrl}
        alt={work.title}
        fill
        // 50/50 Split above 768px, then single column below — keep in sync with Split.module.scss
        sizes="(max-width: 768px) 100vw, 50vw"
        className={styles.previewImage}
      />
    </div>
  )
}
