import Head from "next/head";
import { useRef } from "react";
import { useRouter } from "next/router";

import Hero from "components/hero";
import useGoogleAuth from "hooks/useGoogleAuth";

export default function Home() {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  useGoogleAuth({
    googleBtnRef,
    isUserLoggedIn: false,
    successCallback: () => {
      router.push("/profile")
      console.log("success signing in");
    },
    errorCallback: () => {console.log("error signing in")},
  });

  return (
    <>
      <Head>
        <link href="https://fonts.cdnfonts.com/css/br-firma" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

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

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   return {
//     props: {},
//   };
// }
