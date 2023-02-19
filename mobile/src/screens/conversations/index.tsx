import React from 'react';

import Layout from '@components/layout';
import ConversationList from '@components/conversation/conversationList';
import {ConversationListHeader} from '@components/conversation/conversationListHeader';

import withObservables from '@nozbe/with-observables';

import {database, Conversations as ConversationsModel, Messages as MessageModel} from '@db/index';

type Props = {
  messages: MessageModel[];
  conversations: ConversationsModel[];
};
const Conversations = (props: Props) => {
  const {messages, conversations} = props;
  return (
    <Layout>
      <ConversationList
        conversations={conversations}
        messages={messages}
        conversationListHeader={ConversationListHeader}
      />
    </Layout>
  );
};

const enhance = withObservables(['conversations'], () => ({
  conversations: database.collections.get<ConversationsModel>('conversations').query().observe(),
  messages: database.collections.get<MessageModel>('messages').query().observe(),
}));

export default enhance(Conversations);
