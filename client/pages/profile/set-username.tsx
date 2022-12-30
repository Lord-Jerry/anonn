import { useMutation, useQuery } from '@tanstack/react-query';
import Button from 'components/button';
import Input from 'components/input';
import Navigation from 'components/Navigation';
import { useDebounce } from 'hooks/useDebounce';
import ArrowRight from 'icon/ArrowRight';
import { Logo } from 'icon/logo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useState } from 'react';
import ProfileService from 'services/profile';

export default function SetUsername() {
  const router = useRouter();
  const profileService = new ProfileService();
  const [username, setUsername] = useState('');
  const debouncedSearch = useDebounce(username, 500);

  function isAlphaNumeric(str: string) {
    let regex = new RegExp(/^(?=.*[a-zA-Z])[A-Za-z0-9]+$/);
    return regex.test(str);
  }
  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const { isLoading, data } = useQuery(
    ['usernameData', debouncedSearch],
    () =>
      username.length >= 3 &&
      isAlphaNumeric(username) &&
      profileService.checkUsernameAvailability(username),
    {
      enabled: !!username,
    }
  );

  const { mutate } = useMutation(() => profileService.setUsername(username), {
    onSuccess(data) {
      router.push({
        pathname: '/profile/set-avatar',
        query: router.query,
      });
    },
    onError(err) {
      console.log(err);
    },
  });
  return (
    <Navigation title="Profile setup">
      <div className="mx-auto mt-2 pt-24 px-12 min-[600px]:w-[600px] w-full">
        <Logo />
        <h1 className="font-black text-3xl w-[260px] mb-12 mt-6">
          Welcome to <br />
          Anonn, <span className="font-light">Stranger</span>
        </h1>
        <p className="text-sm font-normal mb-12">
          Quick one, please type in a username{' '}
        </p>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="sillyjumper"
          value={username}
          onChange={onInputChange}
        />
        {username.length >= 3 && data === false && isAlphaNumeric(username) ? (
          <p className="text-xs sm:text-sm text-[#f18d77]">
            Sorry, that username is already taken
          </p>
        ) : username?.length >= 3 && data === true ? (
          <p className="text-xs sm:text-sm text-[#16E5AB]">
            cool username, good to go!
          </p>
        ) : username?.length >= 3 && !isAlphaNumeric(username) ? (
          <p className="text-xs sm:text-sm text-[#f18d77]">
            Invalid username, use only letters and numbers
          </p>
        ) : (
          <ul className="list-disc text-sm font-thin italic mt-4 ml-4">
            <li> Keep it Anonnn! </li>
            <li> Your username should start with a letter</li>
            <li> Your username should be letters and numbers only</li>
            <li>You cannot change your username</li>
          </ul>
        )}
        <Button
          text="Continue"
          icon={<ArrowRight />}
          className="mt-4 btn2"
          onClick={() => data !== false && mutate()}
        />
      </div>
    </Navigation>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username } =
    profileService.validateUserProfile(ctx);

  // if redirection destination is not set-username, redirect to it
  // if (!redirectionDestination.includes('set-username'))
  //   return {
  //     redirect: {
  //       destination: redirectionDestination,
  //     },
  //   };

  if (username)
    return {
      redirect: {
        destination: '/profile',
      },
    };

  return {
    props: {},
  };
}
