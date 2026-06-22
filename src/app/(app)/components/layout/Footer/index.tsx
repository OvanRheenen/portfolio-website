'use client';

import styles from "./Footer.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = {
	'/':				{ name: 'works'},
	'/about':		{ name: 'about' },
	'/contact':	{ name: 'contact' },
}

export default function Footer() {
	const pathname = usePathname();

	return (
		<footer>
			<nav className={styles.footerNav}>
				{Object.entries(navItems).map(([path, { name }]) => (
					<Link
						key={path}
						href={path}
						style={path === pathname ? { textDecoration: 'underline' } : undefined}
					>
						{name}
					</Link>
				))}
			</nav>
		</footer>
	);
}
