"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
	React.useEffect(() => {
		setTimeout(() => {
			window.location.href = "/tarefas";
		}, 1000);
	}, []);

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<Image className={styles.logo} src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
				<Link href="/tarefas">Ir para a página de tarefas</Link>
			</main>
			<footer className={styles.footer}></footer>
		</div>
	);
}
