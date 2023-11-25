import {uniqBy} from 'lodash';
import {useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ConversationService from 'services/conversation';
import {IMessage} from '../types/message';

export default function useFetchMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const [isFetchingOldMessages, setIsFetchingOldMessages] = useState(false);
  const conversationService = new ConversationService();

  const queryKey = ['messages-active', conversationId];
  const {data: messages, isLoading} = useQuery({
    queryKey,
    queryFn: () => conversationService.getConversationMessages(conversationId),
    refetchOnMount: false,
    enabled: true,
  });

  async function fetchPaginatedMessages() {
    const lastMessage = messages?.[messages.length - 1];
    const oldMessages = await conversationService.getConversationMessages(conversationId, lastMessage?.createdAt);
    queryClient.setQueryData(queryKey, uniqBy([...(messages ?? []), ...oldMessages], 'id'));
  }

  async function fetchNewMessagess() {
    const mostRecentMessage = messages?.[0];
    const newMessages = await conversationService.getConversationMessages(
      conversationId,
      mostRecentMessage?.updatedAt,
      'latest',
    );
    queryClient.setQueryData(queryKey, uniqBy([...newMessages, ...(messages ?? [])], 'id'));
  }

  // useEffect(() => {
  //   setImmediate(() => {
  //     fetchNewMessagess().then();
  //   });
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFetchingOldMessages(true);
      fetchNewMessagess().finally(() => setIsFetchingOldMessages(false));
    }, 5000);
    return () => clearInterval(interval);
  }, [messages]);

  return {messages, fetchPaginatedMessages, isFetchingOldMessages};
}
