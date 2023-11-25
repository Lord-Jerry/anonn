import {uniqBy} from 'lodash';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {IMessage} from '../types/message';
import {generateMessageId} from 'utils/message';
import {getMessagesQueryKey} from 'constant/querykeys';
import ConversationService from 'services/conversation';

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const queryKey = getMessagesQueryKey(conversationId);
  const conversationService = new ConversationService();

  const {mutate, isSuccess} = useMutation({
    retry: 100,
    retryDelay: 1000,
    mutationFn: (message: string) => {
      const messageId = generateMessageId();
      queryClient.setQueryData<IMessage[]>(queryKey, (oldMessages = []) =>
        uniqBy(
          [
            {
              isMine: true,
              id: messageId,
              isPending: true,
              content: message,
              isNewMessage: false,
              username: messageId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...oldMessages,
          ],
          'id',
        ),
      );
      return conversationService.sendMessage({id: messageId, content: message, conversationId});
    },
  });

  if (isSuccess) {
    queryClient
      .invalidateQueries({
        queryKey,
        type: 'all',
      })
      .then();
  }

  return {sendMessage: mutate};
}
