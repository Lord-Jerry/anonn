import { useMutation, useQuery } from "@tanstack/react-query";
import ArrowRight from "icon/ArrowRight";
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
    avatar: "",
  });
  const [change, setChange] = useState("");

  const { isLoading, data } = useQuery(["avatarData"], () =>
    profileService.getAvatars()
  );

  const { mutate } = useMutation(() => profileService.setAvatar(avatar.key), {
    onSuccess(data) {
      console.log(data);
      router.push("/profile/set-avatar");
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <div className="mx-auto py-4 px-12 w-[400px]">
      <p className="text-sm text-center">One last step</p>
      <h1 className="text-[32px] font-black text-center mb-12">
        Please select <br />
        an avatar to
        <br />
        continue.
      </h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && data && (
        <>
          <Image
            loader={myLoader}
            src={avatar.avatar || data[Math.floor(Math.random() * data.length)]?.avatar}
            alt="Picture of the author"
            width={100}
            height={100}
            className="rounded-lg mx-auto"
          />
          <p className="text-white font-black text-center mt-6">
            @{props?.username}
          </p>
          <p
            className="opacity-50 text-md text-center underline cursor-pointer"
            onClick={() => setChange("change")}
          >
            change avatar
          </p>
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
      <button
        className="mt-12 flex justify-center items-center bg-[#F8F886] text-black p-4 w-full rounded-lg"
        onClick={() => mutate()}
      >
        Continue <ArrowRight />{" "}
      </button>
      {/* <Button text="continue" theme="black" onClick={onSubmit} /> */}
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
