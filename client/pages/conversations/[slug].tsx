import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";

import Button from "components/button";
import { myLoader } from "utils/imageLoader";
import ProfileService from "services/profile";
import useGoogleAuth, {
  AuthenticateFunctionReturnType,
} from "hooks/useGoogleAuth";
import { useVisitorProfileButtons } from "hooks/useProfileButtons";
import ConversationService from "services/conversation";
import Navigation from "components/Navigation";


export default function SingleConversation() {

  return (
    <Navigation text={`Anonn chat with lord_jay`}>
      <div className="mx-auto py-4 px-12 w-[400px]">
        <p>test single convo</p>
      </div>
    </Navigation>
  );
}
