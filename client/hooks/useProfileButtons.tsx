import Router, { useRouter } from "next/router";
import ArrowRight from "icon/ArrowRight";
import { Props as ButtonPropType } from "components/button";
import AuthService from "services/auth";

export const useProfileButtons = () => {
  const router = useRouter();
  const authService = new AuthService();
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
      onClick: () => {
        authService.logout();
        router.push("/")
      }
    },
  ] as ButtonPropType[];
};

export const useVisitorProfileButtons = (lastConversationId?: string | null) => {
  const router = useRouter();
  const continueConversation = { 
    bg: "bg_yellow",
    text: "Continue last conversation",
    onClick: () => router.push("/conversations")
  }

  return [
    lastConversationId && continueConversation,
    {
      bg: "bg_black",
      text: "Start new conversation",
      onClick:  () => router.push("/conversations")
    }
  ].filter(Boolean) as ButtonPropType[];

}
