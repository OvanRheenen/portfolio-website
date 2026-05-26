import styles from "./Header.module.css";

export default function Header() {
	return (
		<header>
			<div className={styles.headerTitle}>Nina Merk</div>
			{/* TODO: nav only on homepage */}
			<nav className={styles['header-nav']}>
				<a href="#2d">2D</a>
				<a href="#3d">3D</a>
			</nav>
		</header>
	);
}