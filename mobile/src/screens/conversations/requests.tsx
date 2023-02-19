import React from 'react';
import withObservables from '@nozbe/with-observables';

import Layout from '@components/layout';
import ConversationList from '@components/conversation/conversationList';
import {ConversationRequestsHeader} from '@components/conversation/conversationListHeader';

import {database, Conversations as ConversationsModel, Messages as MessageModel} from '@db/index';

type Props = {
  messages: MessageModel[];
  conversations: ConversationsModel[];
};

const ConversationRequests = (props: Props) => {
  const {messages, conversations} = props;
  return (
    <Layout>
      <ConversationList
        messages={messages}
        conversations={conversations}
        conversationListHeader={ConversationRequestsHeader}
      />
    </Layout>
  );
};

const enhance = withObservables(['conversations'], () => ({
  conversations: database.collections.get<ConversationsModel>('conversations').query().observe(),
  messages: database.collections.get<MessageModel>('messages').query().observe(),
}));

export default enhance(ConversationRequests);
