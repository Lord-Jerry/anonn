import Empty from "components/Empty";
import Navigation from "components/Navigation";
import Tab from "components/tab";
import { RequestIcon } from "icon/RequestIcon";
import cookies from "next-cookies";
import { GetServerSidePropsContext } from "next/types";
import { USER_COOKIE_KEYS } from "services/auth";


export default function Dashboard() {

  return (
    <>
    <Navigation />
    <Tab />
    <Empty text="you don’t have anything going on" link="https://copy" icon={<RequestIcon />} />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  let redirectionDestination = "";
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];
  const isUsernameSet = cookie[USER_COOKIE_KEYS.USERNAME];
  const isAvatarSet = cookie[USER_COOKIE_KEYS.AVATAR];

  if (!isUserLoggedIn) redirectionDestination = "/";
  else if (!isUsernameSet) redirectionDestination = "/profile/set-username";
  else if (!isAvatarSet) redirectionDestination = "/profile/set-avatar";

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
