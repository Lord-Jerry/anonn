import {uniqBy} from 'lodash';
import {useEffect, useState} from 'react';
import ConversationService from 'services/conversation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getConversationsQueryKey} from '../constant/querykeys';

export default function useFetchConversations() {
  const queryClient = useQueryClient();
  const [hasMoreOldConversations, setHasMoreOldConversations] = useState(true);
  const [isFetchingOldConversations, setIsFetchingOldConversations] = useState(false);
  const conversationService = new ConversationService();

  const queryKey = getConversationsQueryKey();

  const {isLoading, data: conversations} = useQuery({
    queryKey,
    refetchOnMount: false,
    staleTime: Infinity,
    queryFn: () => conversationService.getAllConversations(),
  });

  async function refreshConversations() {
    const latestConversations = await conversationService.getAllConversations();
    queryClient.setQueryData(queryKey, latestConversations);
  }

  async function fetchPaginatedConversations() {
    if (!hasMoreOldConversations) return;

    setIsFetchingOldConversations(true);
    const lastConversation = conversations?.[conversations.length - 1];
    const oldConversations = await conversationService.getAllConversations(lastConversation?.updatedAt, 'before');
    if (oldConversations.length === 0) {
      setHasMoreOldConversations(false);
    }
    queryClient.setQueryData(queryKey, uniqBy([...(conversations ?? []), ...oldConversations], 'conversationId'));
    setIsFetchingOldConversations(false);
  }

  async function fetchNewConversations() {
    const mostRecentConversation = conversations?.[0];
    const newConversations = await conversationService.getAllConversations(mostRecentConversation?.updatedAt, 'after');
    queryClient.setQueryData(queryKey, uniqBy([...newConversations, ...(conversations ?? [])], 'conversationId'));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [conversations]);

  return {
    isLoading,
    conversations,
    refreshConversations,
    isFetchingOldConversations,
    fetchPaginatedConversations,
  };
}
