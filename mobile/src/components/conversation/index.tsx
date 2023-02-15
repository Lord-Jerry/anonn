import {View, Image, StyleSheet} from 'react-native';

import { formatMessageTimestamp } from '@utils/time'
import Text from '@components/text';
import colors from '@constant/colors';

type Props = {
  title: string;
  avatar: string;
  msgCount: number;
  hasUnreadMsg?: boolean;
  latestMsg: string;
  timestamp: Date;
};

const NewMessageIndicator = (props: {count: number}) => (
  <View style={styles.newMsgIndicator}>
    <Text style={styles.newMessageIndicatorTxt}>{String(props.count)}</Text>
  </View>
);

const shortenMsg = (msg: string = '') => {
  if (msg.length < 40) return msg;
  return `${msg.slice(0, 40)}....`;
};

const Conversation = (props: Props) => {
  return (
    <View style={styles.wrapper}>
      <Image
        style={styles.avatar}
        source={{
          uri: props.avatar,
        }}
      />
      <View style={[styles.wrapper, styles.chatInfo]}>
        <View style={styles.chatWrapper}>
          <Text style={styles.username}>{props.title}</Text>
          <Text style={styles.msg}>{shortenMsg(props.latestMsg)}</Text>
        </View>
        <View style={styles.timestampWrapper}>
          <Text
            style={[
              styles.timestamp,
              props.hasUnreadMsg && styles.timestampNewMessageIndicator,
            ]}>
            {formatMessageTimestamp(props.timestamp)}
          </Text>
          {props.hasUnreadMsg && <NewMessageIndicator count={props.msgCount} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    marginTop: 30,
    marginRight: 20,
    marginLeft: 0,
  },
  chatInfo: {
    flex: 2,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(255, 255, 255, 0.49)',
    borderBottomWidth: 0.2,
    marginTop: 15,
  },
  chatWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 'auto',
  },
  username: {
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 5,
  },
  msg: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.grey,
    lineHeight: 12.5,
  },
  timestampWrapper: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  timestamp: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 5,
    color: colors.light_grey,
  },
  timestampNewMessageIndicator: {
    color: colors.anonn_dark_green,
  },
  newMsgIndicator: {
    height: 20,
    borderRadius: 100,
    color: colors.primary_dark,
    backgroundColor: colors.anonn_dark_green,
    marginTop: 10,

    marginLeft: 5,
  },
  newMessageIndicatorTxt: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.primary_dark,
    padding: 3,
  },
});

export default Conversation;
