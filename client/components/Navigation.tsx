import ArrowLeft from "icon/ArrowLeft";
import Dots from "icon/Dots";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navigation() {
 
  return (
    <div className=" bg-[#16160E] flex justify-around items-center py-8 w-[400px] h-[56px] mx-auto">
      <ArrowLeft />
      <p>Conversations</p>
      <Dots />
    </div>
  );
}
