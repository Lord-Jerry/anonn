import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "components/button";
import Input from "components/input";
import ArrowRight from "icon/ArrowRight";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import ProfileService from "services/profile";

export default function SetUsername() {
  const router = useRouter();
  const profileService = new ProfileService();
  const [username, setUsername] = useState("");

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const { isLoading, data } = useQuery(
    ["usernameData", username],
    () =>
      username.length >= 3 &&
      profileService.checkUsernameAvailability(username),
    {
      enabled: !!username,
    }
  );

  const { mutate } = useMutation(() => profileService.setUsername(username), {
    onSuccess(data) {
      router.push("/profile/set-avatar");
    },
    onError(err) {
      console.log(err);
    },
  });

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
      <Button
        text="Continue"
        icon={<ArrowRight />}
        className="mt-4 btn2"
        onClick={() => data !== false && mutate()}
      />
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username } =
    profileService.validateUserProfile(ctx);

  if (!redirectionDestination.includes("set-username"))
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  if (username)
    return {
      redirect: {
        destination: "/profile",
      },
    };

  return {
    props: {},
  };
}
