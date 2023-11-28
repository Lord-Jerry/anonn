import {set, uniqBy} from 'lodash';
import {useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ConversationService from 'services/conversation';
import {getMessagesQueryKey} from '../constant/querykeys';

export default function useFetchMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const [hasMoreOldMessages, setHasMoreOldMessages] = useState(true);
  const [isFetchingOldMessages, setIsFetchingOldMessages] = useState(false);
  const conversationService = new ConversationService();

  const queryKey = getMessagesQueryKey(conversationId);
  const {isLoading, data: messages} = useQuery({
    queryKey,
    queryFn: () => conversationService.getConversationMessages(conversationId),
    refetchOnMount: true,
    enabled: true,
  });

  async function fetchPaginatedMessages() {
    if (!hasMoreOldMessages) return;

    setIsFetchingOldMessages(true);
    const lastMessage = messages?.[messages.length - 1];
    const oldMessages = await conversationService.getConversationMessages(
      conversationId,
      lastMessage?.createdAt,
      'before',
    );
    if (oldMessages.length === 0) {
      setHasMoreOldMessages(false);
    }
    queryClient.setQueryData(queryKey, uniqBy([...(messages ?? []), ...oldMessages], 'id'));
    setIsFetchingOldMessages(false);
  }

  async function fetchNewMessages() {
    const mostRecentMessage = messages?.[0];
    const newMessages = await conversationService.getConversationMessages(
      conversationId,
      mostRecentMessage?.updatedAt,
      'after',
    );
    queryClient.setQueryData(queryKey, uniqBy([...newMessages, ...(messages ?? [])], 'id'));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewMessages().then();
    }, 5000);
    return () => clearInterval(interval);
  }, [messages]);

  return {
    messages,
    isLoading,
    fetchNewMessages,
    isFetchingOldMessages,
    fetchPaginatedMessages,
  };
}
