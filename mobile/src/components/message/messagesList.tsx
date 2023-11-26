import React from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MessageBubble from '../MessageBubble';
import {IMessage} from 'src//types/message';
import {groupMessagesByDate} from 'utils/message';
import {getMessagesLastReadAtQueryKey} from 'constant/querykeys';

type Props = {
  isLoading: boolean;
  messages: IMessage[];
  conversationId: string;
  recipientAvatar: string;
  handleScrollFetch: () => void;
  isFetchingOldMessages: boolean;
};

const MessagesList = (props: Props) => {
  const queryClient = useQueryClient();
  const lastReadAt = queryClient.getQueryData<Date>(
    getMessagesLastReadAtQueryKey(props.conversationId),
  );
  return (
    <SectionList
      inverted
      renderItem={({item}) => (
        <MessageBubble
          content={item.content}
          incoming={!item.isMine}
          timestamp={item.createdAt}
          avatarUri={props.recipientAvatar}
          isPending={item.isPending}
        />
      )}
      renderSectionFooter={({section: {title}}) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      ListHeaderComponent={props.isLoading ? <ActivityIndicator /> : null}
      ListFooterComponent={
        props.isFetchingOldMessages ? <ActivityIndicator /> : null
      }
      windowSize={21}
      sections={groupMessagesByDate(props.messages, lastReadAt)}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      onEndReachedThreshold={0.5}
      keyExtractor={item => item.id}
      keyboardDismissMode="interactive"
      onEndReached={props.handleScrollFetch}
      // contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  sectionHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    color: 'grey',
  },
  messageBubbleContainer: {
    flexDirection: 'column',
  },
});

export default MessagesList;
