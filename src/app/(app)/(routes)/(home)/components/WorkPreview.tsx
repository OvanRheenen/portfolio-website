import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = { work: Work }

export default function WorkPreview({ work }: Props) {
  return (
    <div 
			className={styles.image}
			style={{ backgroundColor: work.color }} 
		/>
  )
}
