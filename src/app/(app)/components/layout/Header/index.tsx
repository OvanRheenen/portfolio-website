'use client';

import styles from "./Header.module.scss";
import Link from "next/link";
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
					<Link href="/">{title}</Link>
				</div>
			)}
		</header>
	);
}
