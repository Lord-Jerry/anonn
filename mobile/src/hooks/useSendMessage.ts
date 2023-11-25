import {useMutation, useQueryClient} from '@tanstack/react-query';
import ConversationService from 'services/conversation';
import {IMessage} from '../types/message';
import {generateIdFromMessageContent} from 'utils/message';

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['messages-active', conversationId];
  const conversationService = new ConversationService();

  const handlePendingMessage = (content: string) => {
    queryClient.setQueryData<IMessage[]>(queryKey, prev => {
      return [
        ...(prev || []),
        {
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          isMine: true,
          isNewMessage: false,
          id: generateIdFromMessageContent(content),
          username: generateIdFromMessageContent(content),
        },
      ];
    });
  };
  const {mutate, isSuccess} = useMutation({
    mutationFn: (message: string) => conversationService.sendMessage({id: conversationId, content: message}),
  });
}
