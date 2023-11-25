import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {formatMessageTimestamp} from '../utils/time';

type Props = {
  content: string;
  avatarUri: string;
  incoming: boolean;
  timestamp: Date;
};

const MessageBubble = (props: Props) => (
  <View style={[styles.bubbleContainer, props.incoming ? null : styles.rightBubble]}>
    {/* can be used for group messages */}
    {/* {props.incoming && <Image source={{uri: props.avatarUri}} style={styles.avatar} />} */}
    <View style={[styles.bubble, props.incoming ? styles.incomingBubble : styles.outgoingBubble]}>
      <Text style={styles.bubbleText}>{props.content}</Text>
      <Text style={styles.timestamp}>{formatMessageTimestamp(props.timestamp)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  rightBubble: {
    flexDirection: 'row-reverse',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  incomingBubble: {
    backgroundColor: '#f0f0f0',
  },
  outgoingBubble: {
    backgroundColor: '#daf8cb',
  },
  bubbleText: {
    color: 'black',
  },
  timestamp: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: 'grey',
    marginBottom: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default MessageBubble;
