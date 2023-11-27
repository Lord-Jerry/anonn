import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import Spinner from 'components/Spinner';
import Layout from 'components/layout';
import MessageInput from 'components/MessageInput';
import MessageHeader from 'components/MessageHeader';
import MessageList from 'components/message/messagesList';
import useFetchMessages from 'hooks/useFethMessages';
import {IConversation} from 'src//types/conversation';
import {useSendMessage} from 'hooks/useSendMessage';
import {getConversationsQueryKey, getMessagesLastReadAtQueryKey} from 'constant/querykeys';
import ConversationService from 'services/conversation';

type Props = {
  route: {
    params: IConversation;
  };
};

const ConversationMessages = (props: Props) => {
  const {params} = props.route;
  const queryClient = useQueryClient();
  const conversationService = new ConversationService();
  const {
    isLoading,
    messages = [],
    refreshMessages,
    isFetchingOldMessages,
    fetchPaginatedMessages,
  } = useFetchMessages(params.conversationId);
  const {sendMessage} = useSendMessage(params.conversationId);

  const handleMarkConversationAsRead = async () => {
    const latestMessage = messages[0];
    if (!latestMessage) return;
    const conversationLastReadAt = queryClient.getQueryData<Date>(getMessagesLastReadAtQueryKey(params.conversationId));
    if (dayjs(new Date(conversationLastReadAt!)).isAfter(latestMessage.createdAt)) {
      return;
    }

    await conversationService.markConversationAsRead(params.conversationId, messages[0].id);
    const queryKey = getConversationsQueryKey();
    queryClient.setQueryData(getMessagesLastReadAtQueryKey(params.conversationId), Date.now());
    await queryClient.invalidateQueries({
      queryKey,
      type: 'all',
    });
  };

  useEffect(() => {
    handleMarkConversationAsRead().then();
  }, [params.conversationId, messages[0]?.id]);
  return (
    <Layout>
      <>
        <MessageHeader {...params} />
        <MessageList
          messages={messages}
          recipientAvatar={params.avatar}
          isLoading={isLoading}
          refreshMessages={refreshMessages}
          conversationId={params.conversationId}
          handleScrollFetch={fetchPaginatedMessages}
          isFetchingOldMessages={isFetchingOldMessages}
        />
        <MessageInput handleSubmit={sendMessage} />
      </>
    </Layout>
  );
};

export default ConversationMessages;
