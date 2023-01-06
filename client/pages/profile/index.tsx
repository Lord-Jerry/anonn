import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

import Button from 'components/button';
import { myLoader } from 'utils/imageLoader';
import { useProfileButtons } from 'hooks/useProfileButtons';
import ProfileService from 'services/profile';
import Navigation from 'components/Navigation';
import { ShareBtn } from 'components/ShareBtn';
import { FirebaseService } from 'services/firebase';
import { Fragment, useState } from 'react';
import Toogle from 'components/toogle';

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType['props'];

export default function Profile(props: Props) {
  const router = useRouter();
  const [notificationEnabled, setNotificationEnabled] = useState(
    props?.notificationEnabled ? true : false
  );
  const profileButtons = useProfileButtons();

  const onNotificationChange = (checked: boolean) => {
    setNotificationEnabled(checked);
    const firebaseService = new FirebaseService();

    if (checked) firebaseService.promptForNotificationPermission();
    else firebaseService.unsubscribeFromNotification();
  };

  return (
    <Navigation title="Profile">
      <div className="mx-auto pt-24 px-12 min-[600px]:w-[600px] w-full">
        {props?.isNewUser ? (
          <div className="mb-8">
            <h1 className="text-[32px] font-black text-left leading-tight">
              Yaay,
            </h1>
            <h1 className="text-[32px] font-black text-left mb-2 leading-tight">
              you’re all set up!
            </h1>
            <p className="text-[14px] text-left">
              Let the conversations flow, yeah...
            </p>
          </div>
        ) : null}
        <Image
          loader={myLoader}
          src={props?.avatar || ''}
          alt="Profile pic"
          width={100}
          height={100}
          className="rounded-lg mx-auto"
        />
        <p className="text-white font-black text-center mt-6">
          @{props?.username}
        </p>

          <div className="mt-12 mx-auto text-center">
            <Toogle
              label="Notifications"
              checked={notificationEnabled}
              onChange={onNotificationChange}
            />
          </div>

        {profileButtons.map((button, index) => {
          return (
            <Fragment key={index}>
              {button.text === 'Share your profile link' ? (
                <ShareBtn
                  urlLink={`https://anonn.xyz/profile/${props?.username}`}
                />
              ) : (
                <Button
                  key={index}
                  text={button.text}
                  bg={button.bg}
                  icon={button.icon}
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg hover:text-black"
                  onClick={button.onClick}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </Navigation>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username, avatar, notificationEnabled } =
    profileService.validateUserProfile(ctx);

  if (ctx.query.callback) {
    return {
      redirect: {
        destination: ctx.query.callback,
        permanent: false,
      },
    };
  }

  if (redirectionDestination)
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  return {
    props: {
      avatar,
      username,
      notificationEnabled,
      isNewUser: ctx.query?.isNewUser === 'true',
    },
  };
}
