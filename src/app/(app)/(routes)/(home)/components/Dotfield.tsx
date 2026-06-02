import styles from '../Homepage.module.scss'
import type { Work } from './types'

type Props = {
	works: Work[]
	positions: { x: number; y: number }[]
	filter?: string | null
	onHover: (id: string | null) => void
	onSelect: (id: string) => void
}

export default function DotField({
	works,
	positions,
	filter,
	onHover,
	onSelect
}: Props) {
	return (
		<>
			{works.map((work, i) => {
				const faded = !!filter && work.category !== filter
				return (
					<button
						key={work.id}
						className={`${styles.dot} ${faded && styles.isFaded}`}
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
				)
			})}
		</>
	)
}
