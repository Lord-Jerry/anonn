import Head from "next/head";
import cookies from 'next-cookies'
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import Hero from "components/hero";

import SocialAuth from "utils/socialAuth";
import AuthService, { USER_COOKIE_KEYS } from "services/auth";

import { GetServerSidePropsContext } from "next/types";

export default function Home() {
  const router = useRouter();
  const authService = new AuthService();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const onGoogleLogin = async (payload: { credential: string }) => {
    const res = await authService.authenticate(payload.credential, "google");
    if (!res) {
      // display error message
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    SocialAuth.initializeGoogle(googleBtnRef, onGoogleLogin, "signin");
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];

  if (isUserLoggedIn)
    return {
      redirect: {
        destination: '/dashboard',
      },
    };

  return {
    props: {},
  };
}

