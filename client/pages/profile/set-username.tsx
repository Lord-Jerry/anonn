import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "components/button";
import Input from "components/input";
import ArrowRight from "icon/ArrowRight";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { USER_COOKIE_KEYS } from "services/auth";
import ProfileService from "services/profile";

export default function SetUsername(this: any) {
  const router = useRouter();
  const profileService = new ProfileService();
  const [username, setUsername] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState<Boolean>();

  // const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   if (!usernameIsValid) return;

  //   const res = await profileService.setUsername(username);
  //   if (res) router.push("/profile/set-avatar");
  // };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const { isLoading, data } = useQuery(
    ["usernameData", username],
    () => profileService.checkUsernameAvailability(username),
    {
      enabled: !!username,
    }
  );

  const { mutate } = useMutation(() => profileService.setUsername(username), {
    onSuccess(data) {
      console.log(data);
      router.push("/profile/set-avatar");
    },
    onError(err) {
      console.log(err);
    },
  });
  console.log(data, username);
  return (
    <div className="mx-auto py-16 px-12 w-[400px]">
      <h1 className="font-black text-3xl w-[260px] mb-16">
        Welcome to <br />
        Anonn, <span className="font-light">Stranger</span>
      </h1>
      <p className="text-sm font-normal mb-12">
        Quick one, please type in a username{" "}
      </p>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder="@sillyjumper"
        value={username}
        onChange={onInputChange}
      />
      {data === false ? (
        <p>Sorry, that username is already taken</p>
      ) : (
        <ul className="list-disc text-sm font-thin italic mt-4 ml-4">
          <li> Keep it Anonnn! </li>
          <li> You can add letters or numbers </li>
          <li>You cannot change your username</li>
        </ul>
      )}
      <button
        className="mt-12 flex justify-center items-center bg-[#F8F886] text-black p-4 w-full rounded-lg"
        onClick={() => usernameIsValid && mutate()}
      >
        Continue <ArrowRight />{" "}
      </button>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  let redirectionDestination = "";
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];
  const isUsernameSet = cookie[USER_COOKIE_KEYS.USERNAME];

  if (!isUserLoggedIn) redirectionDestination = "/";
  else if (isUsernameSet) redirectionDestination = "/profile/set-avatar";

  if (redirectionDestination)
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  return {
    props: {},
  };
}
