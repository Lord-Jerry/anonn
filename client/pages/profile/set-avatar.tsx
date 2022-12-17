import Button from "components/button";
import cookies from "next-cookies";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { USER_COOKIE_KEYS } from "services/auth";
import ProfileService from "services/profile";

export default function SetAvatar() {
  const router = useRouter();
  const profileService = new ProfileService();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    profileService.setAvatar();
    router.push("/dashboard");
  };

  return (
    <div>
      <h1>Set Avatar</h1>
      <Button text="continue" theme="black" onClick={onSubmit} />
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  let redirectionDestination = "";
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];
  const isAvatarSet = cookie[USER_COOKIE_KEYS.AVATAR];

  if (!isUserLoggedIn) redirectionDestination = "/auth/login";
  else if (isAvatarSet) redirectionDestination = "/dashboard";

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
