import React, {useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useQueryClient} from '@tanstack/react-query';
import {ActivityIndicator, SectionList, StyleSheet, Text, View, RefreshControl} from 'react-native';
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
  refreshMessages: () => Promise<void>;
};

const MessagesList = (props: Props) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastReadAt = queryClient.getQueryData<Date>(getMessagesLastReadAtQueryKey(props.conversationId));

  const onRefresh = () => {
    setIsRefreshing(true);
    props.refreshMessages().finally(() => {
      setIsRefreshing(false);
    });
  };
  return (
    <FlashList
      inverted
      renderItem={({item}: {item: string | IMessage}) => {
        if (typeof item === 'string') {
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item}</Text>
            </View>
          );
        } else
          return (
            <MessageBubble
              key={item.id}
              content={item.content}
              incoming={!item.isMine}
              timestamp={item.createdAt}
              avatarUri={props.recipientAvatar}
              isPending={item.isPending}
            />
          );
      }}
      ListHeaderComponent={props.isLoading ? <ActivityIndicator /> : null}
      ListFooterComponent={props.isFetchingOldMessages ? <ActivityIndicator /> : null}
      estimatedItemSize={50}
      data={groupMessagesByDate(props.messages, lastReadAt)}
      onEndReachedThreshold={0.5}
      getItemType={item => {
        return typeof item === 'string' ? 'sectionHeader' : 'message';
      }}
      keyboardDismissMode="interactive"
      onEndReached={props.handleScrollFetch}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
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
