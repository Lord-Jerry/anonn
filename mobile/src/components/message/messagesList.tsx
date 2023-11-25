import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import MessageBubble from '../MessageBubble';
import {IMessage} from 'src//types/message';

type Props = {
  messages: IMessage[];
  recipientAvatar: string;
  handleScrollFetch: () => void;
};

const MessagesList = (props: Props) => {
  return (
    <FlatList
      inverted
      renderItem={({item}) => (
        <MessageBubble
          content={item.content}
          incoming={!item.isMine}
          timestamp={item.createdAt}
          avatarUri={props.recipientAvatar}
        />
      )}
      windowSize={21}
      data={props.messages}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      onEndReachedThreshold={0.5}
      keyExtractor={item => item.id}
      keyboardDismissMode="interactive"
      onEndReached={props.handleScrollFetch}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
});

export default MessagesList;
