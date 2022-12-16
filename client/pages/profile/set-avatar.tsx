import cookies from 'next-cookies'
import { GetServerSidePropsContext } from "next/types";
import { USER_COOKIE_KEYS } from "services/auth";

export default function SetAvatar() {
  return (
    <div>
      <h1>Set Avatar</h1>
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
