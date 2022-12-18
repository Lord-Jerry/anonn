import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import cookies from "next-cookies";
import Hero from "components/hero";
import AuthService, { USER_COOKIE_KEYS } from "services/auth";
import SocialAuth from "utils/socialAuth";
import { GetServerSidePropsContext } from "next/types";
import Head from "next/head";
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
    // @ts-ignore
    if (window.google) return
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.addEventListener("load", function () {
      SocialAuth.initializeGoogle(googleBtnRef, onGoogleLogin, "signup");
    });
    script.src = "https://accounts.google.com/gsi/client";
    document.getElementsByTagName("head")[0].appendChild(script);
  }, []);
  return (
    <>
      <Head>
        <script src="https://accounts.google.com/gsi/client" async defer />
        <link href="https://fonts.cdnfonts.com/css/br-firma" rel="stylesheet" />
      </Head>
      <Hero />
      <div className="flex justify-center py-6 px-[80px]" ref={googleBtnRef} />
      <p className="text-xs text-center opacity-50 pt-8 pb-2">
        By signing in you agree to our
      </p>
      <p className="text-sm text-center">
        Terms of Service, Privacy policy, <span className="opacity-50">&</span>{" "}
        Cookie policy
      </p>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];

  if (isUserLoggedIn)
    return {
      redirect: {
        destination: "/dashboard",
      },
    };

  return {
    props: {},
  };
}
