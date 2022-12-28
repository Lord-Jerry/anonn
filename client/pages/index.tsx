import { useRef } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import ProfileService from 'services/profile';
import Hero from 'components/hero';
import useGoogleAuth from 'hooks/useGoogleAuth';
import Button from 'components/button';
import Link from 'next/link';

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType['props'];

export default function Home(props: Props) {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  useGoogleAuth({
    googleBtnRef,
    isUserLoggedIn: false,
    successCallback: () => {
      router.push('/profile');
      console.log('success signing in');
    },
    errorCallback: () => {
      console.log('error signing in');
    },
  });

  return (
    <>
      <Hero />
      {!props.isloggedIn && (
        <div
          className="flex justify-center py-6 px-[80px]"
          ref={googleBtnRef}
        />
      )}

      {props.isloggedIn && (
        <div className="min-[600px]:w-[400px] mx-auto">
          <>
            <p className="text-center font-extrabold text-xl">
              Welcome back, @{props?.username}
            </p>
            <Link href={'/profile'}>
              <Button
                text="Go to profile"
                bg="bg_yellow"
                className="mt-12 flex justify-center items-center p-4 w-[400px] mx-auto rounded-lg"
                onClick={() => 'reject'}
              />
            </Link>
          </>
        </div>
      )}
      <p className="text-xs text-center opacity-50 pt-8 pb-2">
        By signing in you agree to our
      </p>
      <p className="text-sm text-center text-[#F8F886] pb-8">
        Terms of Service, Privacy policy, <span className="opacity-50">&</span>{' '}
        Cookie policy
      </p>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { token, username: currentUserUsername } =
    profileService.validateUserProfile(ctx);

  return {
    props: {
      isloggedIn: !!token,
      username: currentUserUsername,
    },
  };
}
