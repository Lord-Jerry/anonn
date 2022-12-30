import Navigation from "components/Navigation";
import { useRouter } from "next/router";
import React from "react";


export default function polls() {
    const router = useRouter();

    const handleBackButton =()=>{
        router.push("/profile");
    }
  return (
    <>
      <Navigation title="Polls"  backButton={{
          disable: false,
          onClick: handleBackButton,
        }} />
      <div className="flex justify-center items-center h-[100vh] w-full">
        <div className="mx-auto">Coming soon, lol</div>
      </div>
    </>
  );
}
