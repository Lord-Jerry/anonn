import { useRouter } from "next/router";
import ArrowRight from "icon/ArrowRight";
import { Props as ButtonPropType } from "components/button";

export const useProfileButtons = () => {
  const router = useRouter();
  return [
    {
      bg: "bg_yellow",
      text: "Share your profile link",
      icon: <ArrowRight />,
      onClick: () => null,
    },
    {
      bg: "bg_black",
      text: "Conversations",
      onClick: () => router.push("/conversations"),
    },
    {
      bg: "bg_black",
      text: "Polls",
      onClick: () => router.push("/polls"),
    },

    {
      bg: "bg_black",
      text: "Log out",
      onClick: () => router.push("/logout"),
    },
  ] as ButtonPropType[];
};

export const useVisitorProfileButtons = (lastConversationId?: string | null) => {
  // const router = useRouter();
  const continueConversation = { 
    bg: "bg_yellow",
    text: "Continue last conversation",
    onClick: () => null
  }

  return [
    lastConversationId && continueConversation,
    {
      bg: "bg_black",
      text: "Start new conversation",
      onClick: () => null,
    }
  ].filter(Boolean) as ButtonPropType[];

}
