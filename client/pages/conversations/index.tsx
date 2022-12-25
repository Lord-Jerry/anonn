import Empty from "components/Empty";
import Navigation from "components/Navigation";
import Tab from "components/tab";
import { RequestIcon } from "icon/RequestIcon";
import { GetServerSidePropsContext } from "next/types";
import ProfileService from "services/profile";

export default function Dashboard() {
  return (
    <>
      <Navigation />
      <Tab />
      <Empty
        text="you don’t have anything going on"
        link="https://copy"
        icon={<RequestIcon />}
      />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination } = profileService.validateUserProfile(ctx);

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
