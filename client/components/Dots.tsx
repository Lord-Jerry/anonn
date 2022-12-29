import DotsIcon from "icon/DotsIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AuthService from "services/auth";

function Dots() {
  const authService = new AuthService();
  const router = useRouter();

  return (
    <div className="dropdown relative">
      <span className="">
        <DotsIcon />
      </span>
      <ul className="w-[120px] dropdown-menu absolute right-0 hidden bg-[#16160E] text-xs text-white py-4 px-6">
        <Link href="/profile">
          <li className="text-left py-2 cursor-pointer">Profile</li>
        </Link>
        <li
          className="text-left py-2 cursor-pointer"
          onClick={() => {
            authService.logout();
            router.push("/");
          }}
        >
          Log out
        </li>
      </ul>
    </div>
  );
}

export default Dots;
