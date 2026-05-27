'use client';

import styles from "./Header.module.scss";

export default function HomeHeaderNav() {
	return (
		<nav className={styles['header-nav']}>
			<a href="#2d">2D</a>
			<a href="#3d">3D</a>
		</nav>
	);
}
