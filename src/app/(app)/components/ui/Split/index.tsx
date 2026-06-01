import styles from './Split.module.scss'

type Props = {
	left: React.ReactNode
	right: React.ReactNode
	leftClassName?: string
	rightClassName?: string
}

export default function Split({ left, right, leftClassName, rightClassName }: Props) {
	return (
		<div className={styles.body}>
			<div className={`${styles.left} ${leftClassName ?? ''}`}>{left}</div>
			<div className={`${styles.right} ${rightClassName ?? ''}`}>{right}</div>
		</div>
	)
}
