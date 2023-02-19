import React from 'react';
import {groupBy} from 'lodash';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';

import Conversation from './index';

import avatars from '@constant/avatars';

import {Conversations as ConversationsModel, Messages as MessageModel} from '@db/index';

const {width} = Dimensions.get('window');

type Props = {
  messages: MessageModel[];
  conversations: ConversationsModel[];
  conversationListHeader: React.FC;
};

const ConversationList = (props: Props) => {
  const {messages, conversations} = props;
  const conversationsMessages = groupBy(messages, 'conversationId');
  const avatarKeys = Object.keys(avatars) as Array<keyof typeof avatars>;

  // nosonar
  const sortedConversation = conversations.sort((a, b) => {
    const aMessages = conversationsMessages[a.id] || [];
    const bMessages = conversationsMessages[b.id] || [];

    const aLastMessage = aMessages[aMessages.length - 1];
    const bLastMessage = bMessages[bMessages.length - 1];

    if (!aLastMessage && !bLastMessage) return 0;
    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;

    return bLastMessage.updatedAt > aLastMessage.updatedAt ? 1 : -1;
  });

  const ConversationListHeader = props.conversationListHeader;

  return (
    <FlatList
      style={styles.container}
      ListFooterComponent={<View style={{height: 100}} />}
      ListHeaderComponent={<ConversationListHeader />}
      data={sortedConversation}
      renderItem={({item}) => {
        const selectedConversationsMessages = conversationsMessages[item.id] || [];
        const lastMessage = selectedConversationsMessages[selectedConversationsMessages.length - 1];
        const newConversationMessagesCount = selectedConversationsMessages.filter(msg => true).length;

        return (
          <Conversation
            title={item.name}
            msgCount={newConversationMessagesCount}
            hasUnreadMsg={newConversationMessagesCount > 0 ? true : false}
            latestMsg={lastMessage?.message}
            timestamp={lastMessage?.updatedAt}
            avatar={avatars[avatarKeys[Math.floor(Math.random() * avatarKeys.length)] as never]}
          />
        );
      }}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: 20,
  },
});

export default ConversationList;
