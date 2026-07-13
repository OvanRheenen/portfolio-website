'use client';

import styles from "./Header.module.scss";
import { setHover, toggleLock, useFilter } from "@app/(routes)/(home)/components/filterStore";
import { useMediaQuery } from "@app/components/hooks/useMediaQuery";

const CATEGORIES = ['2d', '3d'] as const;

export default function HomeHeaderNav() {
	const { locked } = useFilter();
	const canHover = useMediaQuery('(hover: hover)');

	return (
		<nav className={styles.headerNav}>
			{CATEGORIES.map((cat) => {
				const isLocked = locked === cat;
				return (
					<button
						key={cat}
						type="button"
						aria-pressed={isLocked}
						style={(isLocked ? { textDecoration: 'underline' } : {})}
						onMouseEnter={canHover ? () => setHover(cat) : undefined}
						onMouseLeave={canHover ? () => setHover(null) : undefined}
						onClick={() => toggleLock(cat)}
					>
					{cat.toUpperCase()}
					</button>
				);
			})}
		</nav>
	);
}
