'use client';

import styles from "./Footer.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = {
	'/': 				{ name: 'home'},
	'/about':		{ name: 'about' },
	'/contact':	{ name: 'contact' },
}

export default function Footer() {
	const pathname = usePathname();

	return (
		<footer>
			<nav className={styles['footer-nav']}>
				{Object.entries(navItems).map(([path, { name }]) => {
        	if (path === pathname) return null;
        	return (
          	<Link key={path} href={path}>
            	{name}
          	</Link>
        	);
      	})}
			</nav>
		</footer>
	);
}