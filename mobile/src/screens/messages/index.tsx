import React, {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';

import Layout from 'components/layout';
import MessageInput from 'components/MessageInput';
import MessageHeader from 'components/MessageHeader';
import MessageList from 'components/message/messagesList';
import useFetchMessages from 'hooks/useFethMessages';
import {IConversation} from 'src//types/conversation';
import {useSendMessage} from 'src//hooks/useSendMessage';
import {getMessagesLastReadAtQueryKey} from 'src//constant/querykeys';

type Props = {
  route: {
    params: IConversation;
  };
};

const ConversationMessages = (props: Props) => {
  const {params} = props.route;
  const queryClient = useQueryClient();
  const {
    isFetchingOldMessages,
    // isLoading,
    messages = [],
    fetchPaginatedMessages,
  } = useFetchMessages(params.conversationId);
  const {sendMessage} = useSendMessage(params.conversationId);

  useEffect(() => {
    return () => {
      console.log('last read at', Date.now());
      queryClient.setQueryData(getMessagesLastReadAtQueryKey(params.conversationId), Date.now());
    };
  }, [params.conversationId]);
  return (
    <Layout>
      <>
        <MessageHeader {...params} />
        <MessageList
          messages={messages}
          recipientAvatar={params.avatar}
          conversationId={params.conversationId}
          handleScrollFetch={fetchPaginatedMessages}
        />
        <MessageInput handleSubmit={sendMessage} />
      </>
    </Layout>
  );
};

export default ConversationMessages;
