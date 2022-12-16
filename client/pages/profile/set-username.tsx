import Button from "components/button";
import Input from "components/input";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { USER_COOKIE_KEYS } from "services/auth";
import ProfileService from "services/profile";

export default function SetUsername() {
  const router = useRouter();
  const profileService = new ProfileService();
  const [username, setUsername] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState<Boolean>();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!usernameIsValid) return;

    const res = await profileService.setUsername(username);
    if (res) router.push("/profile/set-avatar");
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);

    if (e.target.value.length < 3) return;
    const usernameAvailable = await profileService.checkUsernameAvailability(
      e.target.value
    );
    setUsernameIsValid(usernameAvailable);
  };
  return (
    <div className="w-64 flex-1 justify-center">
      <h1>Set username</h1>
      <Input
        id="username"
        name="username"
        type="text"
        placeholder=""
        value={username}
        onChange={onInputChange}
      />
      <Button text="continue" theme="black" onClick={onSubmit} />
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  let redirectionDestination = "";
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];
  const isUsernameSet = cookie[USER_COOKIE_KEYS.USERNAME];

  if (!isUserLoggedIn) redirectionDestination = "/auth/login";
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
