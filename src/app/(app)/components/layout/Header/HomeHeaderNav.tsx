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
					<a
						key={cat}
						aria-current={isLocked ? 'true' : undefined}
						style={(isLocked ? { textDecoration: 'underline' } : {})}
						onMouseEnter={canHover ? () => setHover(cat) : undefined}
						onMouseLeave={canHover ? () => setHover(null) : undefined}
						onClick={(e) => { e.preventDefault(); toggleLock(cat); }}
					>
					{cat.toUpperCase()}
					</a>
				);
			})}
		</nav>
	);
}
