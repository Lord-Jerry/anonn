import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faClock} from '@fortawesome/free-solid-svg-icons/';
import {formatMessageTimestamp} from '../utils/time';

type Props = {
  content: string;
  avatarUri: string;
  incoming: boolean;
  timestamp: Date;
  isPending?: boolean;
};

const MessageSentIndicator = () => (
  <FontAwesomeIcon style={styles.indicatorIcon} icon={faCheck} size={14} color="grey" />
);

const MessagePendingIndicator = () => (
  <FontAwesomeIcon style={styles.indicatorIcon} icon={faClock} size={14} color="grey" />
);

const MessageBubble = (props: Props) => (
  <View style={[styles.bubbleContainer, props.incoming ? null : styles.rightBubble]}>
    {/* can be used for group messages */}
    {/* {props.incoming && <Image source={{uri: props.avatarUri}} style={styles.avatar} />} */}
    <View style={[styles.bubble, props.incoming ? styles.incomingBubble : styles.outgoingBubble]}>
      <Text style={styles.bubbleText}>{props.content}</Text>
      <Text style={styles.timestamp}>{formatMessageTimestamp(props.timestamp)}</Text>
      {!props.incoming && !props.isPending && <MessageSentIndicator />}
      {!props.incoming && props.isPending && <MessagePendingIndicator />}
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
    // flexWrap: 'wrap',
    flexDirection: 'row',
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
    flexShrink: 1,
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    color: 'grey',
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  indicatorIcon: {
    flex: 1,
    marginTop: 5,
    marginLeft: 5,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
