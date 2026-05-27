'use client';

import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";
import HomeHeaderNav from "./HomeHeaderNav";

export default function Header() {
	const pathname = usePathname();

	return (
		<header>
			<div className={styles['header-title']}>Nina Merk</div>
			{pathname === "/" && <HomeHeaderNav />}
		</header>
	);
}