import {get, uniqBy} from 'lodash';
import {useEffect} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import ConversationService from 'services/conversation';
import {getConversationsQueryKey} from '../constant/querykeys';

export default function useFetchConversations() {
  const queryClient = useQueryClient();
  const conversationService = new ConversationService();

  const queryKey = getConversationsQueryKey();

  const {data: conversations} = useQuery({
    queryKey,
    refetchOnMount: false,
    staleTime: Infinity,
    queryFn: () => conversationService.getAllConversations('active'),
  });

  async function fetchPaginatedConversations() {
    const lastConversation = conversations?.[conversations.length - 1];
    const newConversations = await conversationService.getAllConversations('active', lastConversation?.updatedAt);
    queryClient.setQueryData(queryKey, uniqBy([...(conversations ?? []), ...newConversations], 'conversationId'));
  }

  async function fetchNewConversations() {
    const mostRecentConversation = conversations?.[0];
    const newConversations = await conversationService.getAllConversations(
      'active',
      mostRecentConversation?.updatedAt,
      'latest',
    );
    queryClient.setQueryData(queryKey, uniqBy([...newConversations, ...(conversations ?? [])], 'conversationId'));

    newConversations.forEach(async conversation => {
      console.log('refetching', conversation.conversationId);
      // await queryClient.invalidateQueries({
      //   queryKey: ['messages-active', conversation.conversationId],
      //   type: 'all',
      // });
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewConversations();
    }, 5000);
    return () => clearInterval(interval);
  }, [conversations]);

  return {conversations, fetchPaginatedConversations};
}
