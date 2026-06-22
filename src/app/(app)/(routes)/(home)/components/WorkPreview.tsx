import Image from 'next/image'
import styles from '../Homepage.module.scss'
import { BP_MD } from '@app/lib/breakpoints'
import type { Work } from './types'

type Props = { work: Work }

export default function WorkPreview({ work }: Props) {
  return (
    <div className={styles.image}>
      <Image
        src={work.previewUrl}
        alt={work.title}
        fill
        // 50/50 Split above the md breakpoint, then single column below
        sizes={`(max-width: ${BP_MD}px) 100vw, 50vw`}
        className={styles.previewImage}
      />
    </div>
  )
}
