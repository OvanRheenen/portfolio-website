'use client';

import styles from "./Header.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeHeaderNav from "./HomeHeaderNav";

export default function Header() {
	const pathname = usePathname();
	const title = "Nina Merk";

	const onTitleClick = (e: React.MouseEvent) => {
		if (pathname !== "/") return; // let the Link navigate
		e.preventDefault();
		if (window.location.search) {
			window.history.pushState({}, "", "/");
			window.dispatchEvent(new PopStateEvent("popstate"));
		}
		// re-scatter the dotfield without a reload (home listens for this)
		window.dispatchEvent(new Event("reshuffle"));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<header>
			<div className={styles.headerTitle}>
					<Link href="/" onClick={onTitleClick}>{title}</Link>
			</div>
			{pathname === "/" && <HomeHeaderNav />}
		</header>
	);
}
