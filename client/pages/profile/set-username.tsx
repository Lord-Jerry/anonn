import cookies from 'next-cookies'
import { GetServerSidePropsContext } from "next/types";
import { USER_COOKIE_KEYS } from "services/auth";

export default function SetUsername() {
  return (
    <div>
      <h1>Set username</h1>
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
