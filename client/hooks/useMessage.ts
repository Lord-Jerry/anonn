import { uniqBy, groupBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import ConversationService from "services/conversation";
import { Message } from "types/message";
import { dateSort } from "utils/timeSort";
import useScroll from "./useScroll";
import { useRouter } from "next/router";

const addNewMessageLabel = (messages: Message[]) => {
  const groupedMessages = groupBy(messages, (msg) =>
    msg.isNewMessage ? "new" : "old"
  );
  const { old: oldMessages = [], new: newMessages = [] } = groupedMessages;
  const lastOldMessage = oldMessages[0];

  const newMessageLabel = lastOldMessage
    ? [
        {
          ...lastOldMessage,
          id: "newMessageLabel",
          updatedAt: new Date(
            new Date(lastOldMessage.updatedAt).getTime() + 1000
          ),
        },
      ]
    : [];

  return [
    ...messages,
    ...(newMessages.length > 0 ? newMessageLabel : []),
    ...(newMessages || []),
  ]?.sort(dateSort);
};

export default function useMessage(
  conversationId: string,
  onSentMessageSuccessCallback?: () => void
) {
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState<Message[]>([]);
  const [scrollLoading, setScrollLoading] = useState(false);
  const router = useRouter();
  const conversationService = new ConversationService();
  const { isLoading: conversationLoading, data: conversation } = useQuery(
    ["conversation", conversationId],
    () => conversationService.getSingleConversation(conversationId)
  );

  const { isLoading: messagesLoading, data: messages } = useQuery(
    ["conversationMessages", conversationId],
    () => conversationService.getConversationMessages(conversationId)
  );

  const { isLoading: conversationUpdateLoading, mutate: mutateConversation } =
    useMutation(
      (action: "approve" | "reject") =>
        conversationService.updateConversationStatus({
          conversationId,
          action,
        }),
      {
        onSuccess(data) {
          console.log(data);
          queryClient.invalidateQueries(["conversation"]);
        },
      }
    );

  const { isLoading: sendingMessage, mutate } = useMutation(
    (content: string) =>
      conversationService.sendMessage({ id: conversationId, content }),
    {
      onSuccess(data) {
        console.log(data);
        queryClient.invalidateQueries(["conversationMessages"]);
        onSentMessageSuccessCallback && onSentMessageSuccessCallback();
      },
      onError(data) {
        console.log(data);
      },
    }
  );
  const { isLoading: initMessage, mutate: firstMessage } = useMutation(
    (content: string) =>
      conversationService.startConversation({ id: conversationId, content }),
    {
      onSuccess(data) {
        console.log(data);
        queryClient.invalidateQueries(["conversationMessages"]);
        onSentMessageSuccessCallback && onSentMessageSuccessCallback();
        router.push("/conversations");
      },
      onError(data) {
        console.log(data);
      },
    }
  );

  const handleScrollfetch = async (scrolltype?: string) => {
    if (messagesLoading || conversationLoading || sendingMessage) return;

    const oldestMessage = messages && messages[messages.length - 1];
    if (scrolltype === "down" || !oldestMessage) return;

    setScrollLoading(true);
    const oldMessages = await conversationService.getConversationMessages(
      conversationId,
      oldestMessage.updatedAt
    );

    setMsg((prev) => {
      return uniqBy([...oldMessages, ...prev], "id");
    });
    setScrollLoading(false);
  };
  const { ref } = useScroll((pos) => null);

  useEffect(() => {
    if (sendingMessage || messagesLoading || conversationLoading) return;
    const intervalId = setInterval(async () => {
      const lastMessage = messages && messages[0];
      if (!lastMessage) return;

      const newMessages = await conversationService.getConversationMessages(
        conversationId,
        lastMessage.updatedAt,
        "latest"
      );

      setMsg((prev = []) => {
        const markPreviousMessagesAsRead = prev.map((msg) => ({
          ...msg,
          isRead: true,
        }));
        return [...markPreviousMessagesAsRead, ...newMessages];
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [messages]);

  return {
    scrollRef: ref,
    conversation,
    sendingMessage,
    messagesLoading,
    conversationLoading,
    sendMessage: mutate,
    firstMessage: firstMessage,
    initMessage,
    messages: uniqBy(addNewMessageLabel([...(messages || []), ...msg]), "id"),
    updateConversationStatus: mutateConversation,
    conversationUpdateLoading,
  };
}
