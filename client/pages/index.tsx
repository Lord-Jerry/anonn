import Head from "next/head";
import { useRef } from "react";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";

import Hero from "components/hero";
import useGoogleAuth from "hooks/useGoogleAuth";
import { USER_COOKIE_KEYS } from "services/auth";
export default function Home() {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  useGoogleAuth({
    googleBtnRef,
    isUserLoggedIn: false,
    successCallback: () => router.push("/"),
    errorCallback: () => {},
  });

  return (
    <>
      <Head>
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
