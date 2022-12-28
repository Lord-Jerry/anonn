import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "components/button";
import ArrowRight from "icon/ArrowRight";
import Share from "icon/Share";
import cookies from "next-cookies";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import ProfileService from "services/profile";
import { USER_COOKIE_KEYS } from "services/auth";
import { myLoader } from "utils/imageLoader";

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType["props"];

export default function SetAvatar(props: Props) {
  const router = useRouter();
  const profileService = new ProfileService();
  const [avatar, setAvatar] = useState({
    key: "",
    avatar: "",
  });
  const [change, setChange] = useState("");

  const { isLoading, data } = useQuery(
    ["avatarData"],
    () => profileService.getAvatars(),
    {
      onSuccess(data) {
        const d = data[Math.floor(Math.random() * data.length)];
        setAvatar({ key: d.key, avatar: d.avatar });
      },
    }
  );

  const { mutate } = useMutation(() => profileService.setAvatar(avatar.key), {
    onSuccess() {
      router.push({
        pathname: "/profile",
        query: {
          isNewUser: true,
        },
      });
    },
    onError(err) {
      console.log(err);
      setChange("");
      router.push({
        pathname: "/profile",
        query: {
          isNewUser: true,
        },
      });
    },
  });

  return (
    <div className="mx-auto py-4 px-12 min-[600px]:w-[600px] w-[412px]">
      <>
        <p className="text-sm text-center">One last step</p>
        <h1 className="text-[32px] font-black text-center mb-12 leading-tight">
          Please select <br />
          an avatar to
          <br />
          continue.
        </h1>
      </>
      {isLoading && (
        <div className="flex justify-center items-center h-[600px]">
          Fetching data...
        </div>
      )}
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
      <Button
        text="continue"
        icon={<ArrowRight />}
        className="mt-12 btn2"
        onClick={() => mutate()}
      />
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username, avatar } =
    profileService.validateUserProfile(ctx);

  if (!redirectionDestination.includes("set-avatar"))
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  if (avatar)
    return {
      redirect: {
        destination: "/profile",
      },
    };

  return {
    props: {
      username,
    },
  };
}
