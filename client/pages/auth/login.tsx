import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function Home() {
	const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
const  [user, setUser] = useState<any>({});

	useEffect(() => {
		if (user?._id || gsiScriptLoaded) return;
        console.log(GOOGLE_CLIENT_ID)

		const initializeGsi = () => {
			// Typescript will complain about window.google
			// Add types to your `react-app-env.d.ts` or //@ts-ignore it.
			if (!window.google || gsiScriptLoaded) return;

			setGsiScriptLoaded(true);
			window.google.accounts.id.initialize({
				client_id: GOOGLE_CLIENT_ID,
				callback: (response) => console.log(response),
			});
		};

		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.onload = initializeGsi;
		script.async = true;
		script.id = "google-client-script";
		document.querySelector("body")?.appendChild(script);

		return () => {
			// Cleanup function that runs when component unmounts
			window.google?.accounts.id.cancel();
			document.getElementById("google-client-script")?.remove();
		};
	}, [user?._id]);
	return (
		<div className={styles.container}>
			<Head>
				<title>Login</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
				<script src="https://accounts.google.com/gsi/client" async defer />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					Welcome to <a href="https://anonn.app">Anon.app!</a>
				</h1>

                <button className={"g_id_signin"}/>

				<p className={styles.description}>
					Get started by editing{" "}
					<code className={styles.code}>pages/index.tsx</code>
				</p>

				<div className={styles.grid}>
					<a href="https://nextjs.org/docs" className={styles.card}>
						<h2>Documentation &rarr;</h2>
						<p>Find in-depth information about Next.js features and API.</p>
					</a>

					<a href="https://nextjs.org/learn" className={styles.card}>
						<h2>Learn &rarr;</h2>
						<p>Learn about Next.js in an interactive course with quizzes!</p>
					</a>

					<a
						href="https://github.com/vercel/next.js/tree/canary/examples"
						className={styles.card}
					>
						<h2>Examples &rarr;</h2>
						<p>Discover and deploy boilerplate example Next.js projects.</p>
					</a>

					<a
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.card}
					>
						<h2>Deploy &rarr;</h2>
						<p>
							Instantly deploy your Next.js site to a public URL with Vercel.
						</p>
					</a>
				</div>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	);
}
