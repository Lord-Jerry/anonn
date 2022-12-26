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
