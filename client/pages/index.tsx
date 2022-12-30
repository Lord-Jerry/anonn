import { useRef } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import ProfileService from 'services/profile';
import Hero from 'components/hero';
import useGoogleAuth from 'hooks/useGoogleAuth';
import Button from 'components/button';
import Link from 'next/link';
import Head from 'next/head';
import ArrowRight from 'icon/ArrowRight';
import Footer from 'components/Footer';

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
      <Head>
        <title>Anonn</title>
        <meta property="title" content="Anonn" />
        <meta property="og:title" content="Anonn" />
        <meta
          property="description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
        <meta
          property="og:description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
      </Head>
      <Hero hideText={props.isloggedIn} />
      {!props.isloggedIn && (
        <div
          className="flex justify-center py-6 px-[80px]"
          ref={googleBtnRef}
        />
      )}

      {props.isloggedIn && (
        <div className="min-[600px]:w-[400px] mx-auto pt-4">
          <>
            <p className="text-center font-bold text-4xl">Welcome back</p>
            <p className="text-center text-base pt-2">@{props?.username}</p>
            <Link href={'/profile'}>
              <Button
                text="Continue"
                bg="bg_yellow"
                onClick={() => null}
                icon={<ArrowRight />}
                className="mt-12 flex justify-center items-center px-8 min-[600px]:w-[400px] p-4 w-[350px] mx-auto rounded-lg"
              />
            </Link>
          </>
        </div>
      )}
   <Footer />
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
      username: currentUserUsername || '',
    },
  };
}
