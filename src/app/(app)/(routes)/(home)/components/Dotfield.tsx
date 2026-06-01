import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = {
	works: Work[]
	positions: { x: number; y: number }[]
	onHover: (id: string | null) => void
	onSelect: (id: string) => void
}

export default function DotField({
	works,
	positions,
	onHover,
	onSelect
}: Props) {
	return (
		<>
			{works.map((work, i) => (
				<button
					key={work.id}
					className={styles.dot}
					style={{
						backgroundColor: work.color,
						left: `${positions[i].x}%`,
						top: `${positions[i].y}%`,
					}}
					aria-label={work.title}
					onMouseEnter={() => onHover(work.id)}
					onMouseLeave={() => onHover(null)}
					onClick={() => onSelect(work.id)}
				/>
			))}
		</>
	)
}