'use client';

import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";
import HomeHeaderNav from "./HomeHeaderNav";

export default function Header() {
	const pathname = usePathname();
	const title = "Nina Merk";

	return (
		<header>
			{pathname === "/" ? (
				<>
					<div className={styles.headerTitle}>
						{title}
					</div>
					<HomeHeaderNav />
				</>
			) : (
				<div className={styles.headerTitle}>
					<a href="/">{title}</a>
				</div>
			)}
		</header>
	);
}
