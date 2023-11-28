import {uniqBy} from 'lodash';
import React, {useEffect, useState} from 'react';
import ConversationService from 'services/conversation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getConversationsQueryKey} from '../constant/querykeys';

export default function useFetchConversations() {
  const queryClient = useQueryClient();
  const conversationService = new ConversationService();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreOldConversations, setHasMoreOldConversations] = useState(true);
  const [isFetchingOldConversations, setIsFetchingOldConversations] = useState(false);

  const queryKey = getConversationsQueryKey();
  const {isLoading, data: conversations} = useQuery({
    queryKey,
    staleTime: Infinity,
    queryFn: () => conversationService.getAllConversations(),
  });

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    fetchNewConversations().finally(() => {
      setIsRefreshing(false);
    });
  }, []);

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
    fetchNewConversations();
    const interval = setInterval(() => {
      fetchNewConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [conversations]);

  return {
    isLoading,
    onRefresh,
    isRefreshing,
    conversations,
    isFetchingOldConversations,
    fetchPaginatedConversations,
  };
}
