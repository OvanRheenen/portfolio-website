import styles from '../Homepage.module.scss'
import ProjectMedia from './ProjectMedia'
import type { Work } from './types'

type Props = { work: Work }

export default function WorkGallery({ work }: Props) {
  return (
    <div className={styles.gallery}>
      {work.projectImages.map(img => (
        <ProjectMedia
          key={img.url}
          asset={img}
          title={work.title}
          className={styles.projectImage}
        />
      ))}
    </div>
  )
}
