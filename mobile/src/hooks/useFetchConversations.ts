import {uniqBy} from 'lodash';
import {useEffect, useState} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ConversationService from 'services/conversation';
import {getConversationsQueryKey} from '../constant/querykeys';

export default function useFetchConversations() {
  const queryClient = useQueryClient();
  const [hasMoreOldConversations, setHasMoreOldConversations] = useState(true);
  const [isFetchingOldConversations, setIsFetchingOldConversations] =
    useState(false);
  const conversationService = new ConversationService();

  const queryKey = getConversationsQueryKey();

  const {
    isLoading,
    isRefetching,
    data: conversations,
  } = useQuery({
    queryKey,
    refetchOnMount: false,
    staleTime: Infinity,
    queryFn: () => conversationService.getAllConversations(),
  });

  async function fetchPaginatedConversations() {
    if (!hasMoreOldConversations) return;

    setIsFetchingOldConversations(true);
    const lastConversation = conversations?.[conversations.length - 1];
    const oldConversations = await conversationService.getAllConversations(
      lastConversation?.updatedAt,
      'before',
    );
    if (oldConversations.length === 0) {
      setHasMoreOldConversations(false);
    }
    queryClient.setQueryData(
      queryKey,
      uniqBy([...(conversations ?? []), ...oldConversations], 'conversationId'),
    );
    setIsFetchingOldConversations(false);
  }

  async function fetchNewConversations() {
    const mostRecentConversation = conversations?.[0];
    const newConversations = await conversationService.getAllConversations(
      mostRecentConversation?.updatedAt,
      'after',
    );
    queryClient.setQueryData(
      queryKey,
      uniqBy([...newConversations, ...(conversations ?? [])], 'conversationId'),
    );
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
    isFetchingOldConversations,
    fetchPaginatedConversations,
  };
}
