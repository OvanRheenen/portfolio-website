'use client';

import styles from "./Header.module.scss";
import { setHover, toggleLock, useFilter } from "@app/(routes)/(home)/components/filterStore";

const CATEGORIES = ['2d', '3d'] as const;

export default function HomeHeaderNav() {
	const { locked } = useFilter();

	return (
		<nav className={styles.headerNav}>
			{CATEGORIES.map((cat) => {
				const isLocked = locked === cat;
				return (
					<a
						key={cat}
						aria-current={isLocked ? 'true' : undefined}
						style={(isLocked ? { textDecoration: 'underline' } : {})}
						onMouseEnter={() => setHover(cat)}
						onMouseLeave={() => setHover(null)}
						onClick={(e) => { e.preventDefault(); toggleLock(cat); }}
					>
					{cat.toUpperCase()}
					</a>
				);
			})}
		</nav>
	);
}
