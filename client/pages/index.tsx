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
import StarIcon from 'icon/StarIcon';
import Remarks from 'components/Remarks';
import Why from 'components/Why-anonn';

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
        <meta name="title" property="title" content="Anonn" />
        <meta name="og:title" property="og:title" content="Anonn" />
        <meta
          name="description"
          property="description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
      </Head>
      <div className='min-[600px]:w-[400px] mx-auto pt-4"'>
        <Hero hideText={props.isloggedIn} />
      </div>
      {!props.isloggedIn && (
        <div
          className="flex justify-center py-6 pr-[80px] pl-12"
          ref={googleBtnRef}
        />
      )}

      {props.isloggedIn && (
        <div className="min-[600px]:w-[400px] mx-auto pl-8 pt-4">
          <>
            <p className="text-left font-bold text-4xl pt-12">Welcome back</p>
            <p className="text-left text-base pt-1">@{props?.username}</p>
            <Link href={'/profile'}>
              <Button
                text="Continue"
                bg="bg_yellow"
                onClick={() => null}
                icon={<ArrowRight />}
                className="mt-12 mb-4 flex justify-center items-center p-3 w-[280px] rounded-lg"
              />
            </Link>
          </>
        </div>
      )}
      <div className="mb-4 flex justify-left items-center min-[600px]:w-[400px] mx-auto pl-8 pt-4">
        <p className="text-base">4.9/5.0</p>
        {Array.from({ length: 5 }, (v, i) => (
          <div className="mx-1">
            <StarIcon />
          </div>
        ))}
      </div>
      <Why />
      <Remarks />
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
