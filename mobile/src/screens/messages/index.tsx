import React from 'react';

import Layout from 'components/layout';
import MessageInput from 'components/MessageInput';
import MessageHeader from 'components/MessageHeader';
import MessageList from 'components/message/messagesList';
import useFetchMessages from 'hooks/useFethMessages';
import {IConversation} from 'src//types/conversation';

type Props = {
  route: {
    params: IConversation;
  };
};

const ConversationMessages = (props: Props) => {
  const {params} = props.route;
  const {
    isFetchingOldMessages,
    // isLoading,
    messages = [],
    fetchPaginatedMessages,
  } = useFetchMessages(params.conversationId);
  return (
    <Layout>
      <>
        <MessageHeader {...params} />
        <MessageList handleScrollFetch={fetchPaginatedMessages} messages={messages} recipientAvatar={params.avatar} />
        <MessageInput handleSubmit={console.log} />
      </>
    </Layout>
  );
};

export default ConversationMessages;
