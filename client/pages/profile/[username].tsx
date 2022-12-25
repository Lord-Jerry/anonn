import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";

import Button from "components/button";
import { myLoader } from "utils/imageLoader";
import ProfileService from "services/profile";
import useGoogleAuth, {
  AuthenticateFunctionReturnType,
} from "hooks/useGoogleAuth";
import { useVisitorProfileButtons } from "hooks/useProfileButtons";
import ConversationService from "services/conversation";

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType["props"];

export default function Profile(props: Props) {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const profileButtons = useVisitorProfileButtons(props?.lastConversationId);
  useGoogleAuth({
    googleBtnRef,
    isUserLoggedIn: props?.isloggedIn || false,
    successCallback: (user: AuthenticateFunctionReturnType) => {
      if (!user.username) {
        router.push({
          pathname: "/profile/set-username",
          query: { callback: router.asPath },
        });
      } else if (!user.avatar) {
        router.push({
          pathname: "/profile/set-avatar",
          query: { callback: router.asPath },
        });
      } else {
        router.push(router.asPath);
      }
    },
    errorCallback: () => {},
  });
  return (
    <div className="mx-auto py-4 px-12 w-[400px]">
      <div className="mb-6">
        <Image
          loader={myLoader}
          src={props?.avatar || ""}
          alt="Profile pic"
          width={100}
          height={100}
          className="rounded-lg mx-auto"
        />
        <p className="text-white text-[20px] font-black text-center mt-6">
          @{props?.username} wants to have an anonymous chat with you
        </p>
      </div>

      <div>
        {!props?.isloggedIn ? (
          <>
            <p className="text-white text-[16px] text-center  mb-10">
              Pleaseeee sign in to chat.
            </p>
            <div
              className="flex justify-center py-6 px-[80px]"
              ref={googleBtnRef}
            />
          </>
        ) : (
          <>
            {profileButtons.map((button, index) => {
              return (
                <Button
                  key={index}
                  text={button.text}
                  bg={index === 0 ? "bg_yellow" : "bg_black"}
                  // icon={button.icon}
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg"
                  onClick={button.onClick}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { token, username: currentUserUsername } =
    profileService.validateUserProfile(ctx);

  const conversationService = new ConversationService(token);
  const profile = await profileService.findUserByUsername(
    ctx.params?.username as string
  );
  if (!profile) {
    return {
      redirect: {
        destination: "/404",
      },
    };
  }
  if (currentUserUsername === profile.username) {
    return {
      redirect: {
        destination: "/profile",
      },
    };
  }

  const isloggedIn = !!token;
  const lastConversation = isloggedIn
    ? await conversationService.getLastConversationWithUser(profile.id)
    : null;

  return {
    props: {
      userId: profile.id,
      avatar: profile.avatar,
      username: profile.username,
      isloggedIn: !!token,
      lastConversationId: lastConversation?.id || null,
    },
  };
}
