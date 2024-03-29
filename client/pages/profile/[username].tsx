import Image from 'next/image';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

import Button from 'components/button';
import { myLoader } from 'utils/imageLoader';
import ProfileService from 'services/profile';
import useGoogleAuth, {
  AuthenticateFunctionReturnType,
} from 'hooks/useGoogleAuth';
import { useVisitorProfileButtons } from 'hooks/useProfileButtons';
import ConversationService from 'services/conversation';
import Navigation from 'components/Navigation';
import useMessage from 'hooks/useMessage';
import Head from 'next/head';
import Footer from 'components/Footer';
import ChatTextArea from 'components/ChatTextarea';

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType['props'];
export default function Profile(props: Props) {
  const [stage, setStage] = useState(1);
  const conversationId: any = props?.userId;
  const { firstMessage, initMessage } = useMessage(conversationId);
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const profileButtons = useVisitorProfileButtons(props?.lastConversationId);
  useGoogleAuth({
    googleBtnRef,
    isUserLoggedIn: props?.isloggedIn || false,
    successCallback: (user: AuthenticateFunctionReturnType) => {
      const profileService = new ProfileService();
      profileService.setReferer(props?.username as string);

      if (!user.username) {
        router.push({
          pathname: '/profile/set-username',
          query: { callback: router.asPath },
        });
      } else if (!user.avatar) {
        router.push({
          pathname: '/profile/set-avatar',
          query: { callback: router.asPath },
        });
      } else {
        router.push(router.asPath);
      }
    },
    errorCallback: () => {},
  });

  const { conversation } = useMessage(conversationId);

  return (
    <>
      <Head>
        <title>{`Chat anonymously with ${props?.username} - Anonn`}</title>
        <meta name="robots" content="noindex" />
        <meta
          property="og:url"
          content={`https://anonn.xyz/profile/${props?.username}`}
        />
        <meta name="type" property="og:type" content="website" />
        <meta
          name="title"
          property="title"
          content={`Chat anonymously with ${props?.username} - Anonn`}
        />
        <meta
          name="og:title"
          property="og:title"
          content={`Chat anonymously with ${props?.username} - Anonn`}
        />
        <meta
          name="description"
          property="description"
          content={`${props?.username} wants to have an anonymous chat with you`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={`${props?.username} wants to have an anonymous chat with you`}
        />
        <meta
          name="og:image"
          property="og:image"
          content="/images/preview.png"
        />
      </Head>
      <Navigation title="Profile">
        <div className="mx-auto pt-24 px-12 min-[600px]:w-[600px] w-full">
          <div className="mb-6">
            <Image
              loader={myLoader}
              src={props?.avatar || ''}
              alt="Profile pic"
              width={100}
              height={100}
              className="rounded-lg mx-auto"
            />
            <p className="text-white text-[20px] font-black text-center mt-6">
              @{props?.username} wants to have an anonymous chat with you
            </p>
            <p className="mt-8 text-sm leading-normal tracking-tight">
              Welcome to our anonymous chat app! <br />
              We want to ensure your privacy <br />
              and security, so every time you start a new conversation,
              <br />
              we will automatically generate a random username for you. <br />
              This means that you can chat freely without revealing your
              personal identity.
              <br />
              Have fun and stay safe!
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
                <Footer />
              </>
            ) : (
              <>
                {stage === 1 &&
                  profileButtons.map((button, index) => {
                    return (
                      <Button
                        key={index}
                        text={button.text}
                        bg={index === 0 ? 'bg_yellow' : 'bg_black'}
                        className="mt-12 flex justify-center items-center p-4 w-full rounded-lg"
                        onClick={() =>
                          button?.text === 'Start new conversation'
                            ? setStage(2)
                            : router.push(
                                `/conversations/${props.lastConversationId}`
                              )
                        }
                      />
                    );
                  })}
                {stage === 2 && (
                  <ChatTextArea
                    conversation={conversation}
                    sendMessage={firstMessage}
                    sendingMessage={initMessage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Navigation>
    </>
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
        destination: '/404',
      },
    };
  }
  if (currentUserUsername === profile.username) {
    return {
      redirect: {
        destination: '/profile',
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
