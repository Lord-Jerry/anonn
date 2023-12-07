import screens from 'constant/screens';
import {useNavigation} from '@react-navigation/native';
import ConversationService from 'services/conversation';
import {getConversationsQueryKey} from 'constant/querykeys';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export function useInitiateConversation(participantId: string) {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const conversationService = new ConversationService();

  const {mutate} = useMutation({
    mutationFn: (content: string) => {
      return conversationService.startConversation({
        content,
        id: participantId,
      });
    },
    onSuccess: async data => {
      await queryClient.refetchQueries({
        queryKey: getConversationsQueryKey(),
        type: 'all',
      });

      data?.conversationId && navigation.navigate(screens.Message, data as never);
    },
  });

  return {initiateConversation: mutate};
}
