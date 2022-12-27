import { useQuery } from "@tanstack/react-query";
import Empty from "components/Empty";
import MessageBox from "components/MessageBox";
import Navigation from "components/Navigation";
import Tab from "components/tab";
import { RequestIcon } from "icon/RequestIcon";
import cookies from "next-cookies";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { USER_COOKIE_KEYS } from "services/auth";
import ConversationService from "services/conversation";
import { AVATARS } from "constants/index";
import  Router  from "next/router";


export default function Dashboard() {
  // const router =  useRouter();
  const conversationService = new ConversationService();
  const [type, setType] = useState<string>("active");

  const { isLoading, data } = useQuery(["userConversations", type], () =>
    conversationService.getAllConversations(type)
  );
  console.log(data, AVATARS);
  return (
    <>
      <Navigation text="Conversations" />
      <Tab type={type} setType={setType} />
      {isLoading && <p>Loading...</p>}
      {!isLoading && data?.length === 0 && (
        <Empty
          text="you don’t have anything going on"
          link="https://copy"
          icon={<RequestIcon />}
        />
      )}
      {!isLoading && data && data?.length > 0 && (
        data?.map((x:any)=>(
        <div key={x.type} onClick={()=> Router.push({
          pathname: `/conversations/${x?.title}`,
          query: { id: x?.conversationId}
        })}>
        <MessageBox avatar={x?.avatar} username={x?.title} time={(x?.lastMessage?.sentAt)} msg={x?.lastMessage?.content} />
        </div>
      )))}

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
    props: {
      
    },
  };
}
