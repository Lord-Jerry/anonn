import {useQuery} from '@tanstack/react-query';
import UserService from 'services/user';
import ConversationService from '../services/conversation';

export default function useFetchConversationProfile(username: string) {
  const userService = new UserService();
  const conversationService = new ConversationService();
  const {isLoading, data: profile} = useQuery({
    gcTime: 0,
    queryKey: ['conversationProfile', username],
    queryFn: () => userService.findUserByUsername(username),
  });

  const {isLoading: lastConversationLoading, data: lastConversationData} = useQuery({
    enabled: !!profile?.id,
    queryKey: ['lastConversation', profile?.id],
    queryFn: () => conversationService.getLastConversationWithUser(profile?.id as string),
  });

  return {
    profile: {
      ...profile,
      lastConversationId: lastConversationData?.id,
    },
    isLoading: isLoading || lastConversationLoading,
  };
}
