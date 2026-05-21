'use client';

import styles from "../styles/Footer.module.css";
import Link from "next/link";

const navItems = {
	'/': 				{ name: 'home'},
	'/about':		{ name: 'about' },
	'/contact':	{ name: 'contact' },
}

export default function Footer() {
	return (
		<footer>
			<nav className={styles['footer-nav']}>
				{Object.entries(navItems).map(([path, { name }]) => (
					<Link key={path} href={path}>
						{name}
					</Link>
				))}
			</nav>
		</footer>
	);
}