import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import Hero from "components/hero";
import AuthService from "services/auth";
import SocialAuth from "utils/socialAuth";

export { getServerSideProps } from './login';

export default function Home() {
  const router = useRouter();
  const authService = new AuthService();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const onGoogleLogin = async (payload: { credential: string }) => {
    const res = await authService.authenticate(
      payload.credential,
      "google",
      true
    );
    if (!res) {
      // display error message
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    SocialAuth.initializeGoogle(googleBtnRef, onGoogleLogin, "signup");
  }, []);
  return (
    <>
      <Head>
        <script src="https://accounts.google.com/gsi/client" async defer />
      </Head>
      <Hero />
      <div ref={googleBtnRef} />
    </>
  );
}