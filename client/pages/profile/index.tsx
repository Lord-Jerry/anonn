import Image from "next/image";
import { GetServerSidePropsContext } from "next/types";

import Button from "components/button";
import { myLoader } from "utils/imageLoader";
import { useProfileButtons } from "hooks/useProfileButtons";
import ProfileService from "services/profile";
import Navigation from "components/Navigation";

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType["props"];

export default function Profile(props: Props) {
  const profileButtons = useProfileButtons();
  return (
    <Navigation text="Profile">
      <div className="mx-auto pt-24 px-12 w-[400px]">
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
          src={props?.avatar || ""}
          alt="Profile pic"
          width={100}
          height={100}
          className="rounded-lg mx-auto"
        />
        <p className="text-white font-black text-center mt-6">
          @{props?.username}
        </p>

        {profileButtons.map((button, index) => {
          return (
            <Button
              key={index}
              text={button.text}
              bg={button.bg}
              icon={button.icon}
              className="mt-12 flex justify-center items-center p-4 w-full rounded-lg"
              onClick={button.onClick}
            />
          );
        })}
      </div>
    </Navigation>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username, avatar } =
    profileService.validateUserProfile(ctx);

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
      isNewUser: ctx.query?.isNewUser === "true",
    },
  };
}
