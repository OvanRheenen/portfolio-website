import Image from 'next/image'
import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = { work: Work }

export default function WorkGallery({ work }: Props) {
  return (
    <div className={styles.gallery}>
      {work.projectImages.map(img => (
        <Image
          key={img.url}
          src={img.url}
          width={img.width}
          height={img.height}
          alt={work.title}
          className={styles.projectImage}
        />
      ))}
    </div>
  )
}
