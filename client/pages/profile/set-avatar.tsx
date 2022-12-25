import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "components/button";
import ArrowRight from "icon/ArrowRight";
import Share from "icon/Share";
import cookies from "next-cookies";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { useState } from "react";
import { USER_COOKIE_KEYS } from "services/auth";
import ProfileService from "services/profile";
import { myLoader } from "utils/imageLoader";

type GetServerSidePropsReturnType = Awaited<ReturnType<typeof getServerSideProps>>
type Props = GetServerSidePropsReturnType["props"]

export default function SetAvatar(props: Props) {
  const router = useRouter();
  const profileService = new ProfileService();
  const [avatar, setAvatar] = useState({
    key: "",
    avatar: ""
  });
  const [change, setChange] = useState("");
  const [stage, setStage] = useState(1);

  const { isLoading, data } = useQuery(["avatarData"], () =>
    profileService.getAvatars(),
    {
      onSuccess(data) {
        const d = data[Math.floor(Math.random() * data.length)]
        setAvatar({ key: d.key, avatar: d.avatar })
      },
    }
  );

  const { mutate } = useMutation(() => profileService.setAvatar(avatar.key), {
    onSuccess(data) {
      setStage(2)
      router.push("/profile/set-avatar");
    },
    onError(err) {
      console.log(err);
      setStage(2)
      setChange("");
    },
  });

  return (
    <div className="mx-auto py-4 px-12 w-[400px]">
      {stage === 1 && (
      <>
      <p className="text-sm text-center">One last step</p> 
      <h1 className="text-[32px] font-black text-center mb-12 leading-tight">
        Please select <br />
        an avatar to
        <br />
        continue.
      </h1>
      </>
      )}
      {stage === 2 && (
      <>
      <h1 className="text-[32px] font-black text-justify pt-8 mb-2 leading-tight">
        Yaay, <br/>
        you’re all set up!
        <br />     
      </h1>
      <p className="text-sm mb-8 text-justify">Let the conversations flow, yeah...</p> 
      </>
      )}
      {isLoading && <p>Loading...</p>}
      {!isLoading && data && (
        <>
          <Image
            loader={myLoader}
            src={
              avatar.avatar ||
              data[Math.floor(Math.random() * data.length)]?.avatar
            }
            alt="Picture of the author"
            width={100}
            height={100}
            className="rounded-lg mx-auto"
          />
          <p className="text-white font-black text-center mt-6">
            @{props?.username}
          </p>
          {stage === 1 && 
            <p
            className="opacity-50 text-md text-center underline cursor-pointer"
            onClick={() => setChange("change")}
          >
            change avatar
          </p>
          }
        
          {change === "change" && (
            <div className="grid grid-cols-4 grid-flow-row gap-3 p-8">
              {data?.map((x) => (
                <div
                  key={x.key}
                  className={
                    avatar.key === x.key
                      ? `border-2 border-[#F8F886] rounded-3xl`
                      : ""
                  }
                  onClick={() =>
                    setAvatar({
                      key: x.key,
                      avatar: x.avatar,
                    })
                  }
                >
                  <Image
                    key={x.key}
                    loader={myLoader}
                    src={x.avatar}
                    alt="Picture of the author"
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {stage === 1 && 
        <Button
        text="continue"
        icon={<ArrowRight />}
        className="mt-12 btn2"
        onClick={() => mutate()}
      />
      }
      {
        stage === 2 && (
          <>
        <Button
        text="Share your profile link"
        icon={<Share />}
        className="mt-12 btn2"
        onClick={() => mutate()}
      />
        <Button
        text="Go to Dashboard"
        className="mt-4 btn"
        onClick={() => router.push('/dashboard')}
      />
      </>
        )
      }
    
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookie = cookies(ctx);
  let redirectionDestination = "";
  const isUserLoggedIn = cookie[USER_COOKIE_KEYS.TOKEN];
  const username = cookie[USER_COOKIE_KEYS.USERNAME];
  const isAvatarSet = cookie[USER_COOKIE_KEYS.AVATAR];

  if (!isUserLoggedIn) redirectionDestination = "/";
  // else if (isAvatarSet) redirectionDestination = "/dashboard";

  if (redirectionDestination)
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  return {
    props: {
      username,
    },
  };
}
