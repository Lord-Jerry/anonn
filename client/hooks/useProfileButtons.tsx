import { useRouter } from "next/router";
import { Props as ButtonPropType } from "components/button";
import AuthService from "services/auth";
import Share from "icon/Share";

export const useProfileButtons = () => {
  const router = useRouter();
  const authService = new AuthService();
  return [
    {
      bg: "bg_yellow",
      text: "Share your profile link",
      icon: <Share />,
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
    onclick: () => router.push(`/conversations/${lastConversationId}`)
  }

  return [
    lastConversationId && continueConversation,
    {
      bg: "bg_black",
      text: "Start new conversation",
    }
  ].filter(Boolean) as { bg: string; text: string; onclick?: () => void }[];

}
