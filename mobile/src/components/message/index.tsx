import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheckDouble} from '@fortawesome/free-solid-svg-icons/';

import Text from 'components/text';
import {formatMessageTimestamp} from 'utils/time';

type Props = {
  msg: string;
  isMine: boolean;
  timestamp: Date;
};

const MessageIndicator = () => <FontAwesomeIcon style={{marginLeft: 5}} icon={faCheckDouble} size={7} color="white" />;
const Message = (props: Props) => {
  return (
    <View style={[styles.wrapper, {justifyContent: props.isMine ? 'flex-end' : 'flex-start'}]}>
      <View
        style={[
          styles.msgBox,
          {
            backgroundColor: props.isMine ? '#1E1E1E' : '#f8f886',
            justifyContent: props.isMine ? 'flex-end' : 'flex-start',
          },
        ]}>
        <Text style={[styles.msg, {color: props.isMine ? 'white' : 'black'}]}>{props.msg}</Text>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text
            style={[
              styles.timestamp,
              {
                color: props.isMine ? 'white' : 'black',
              },
            ]}>
            {formatMessageTimestamp(props.timestamp)}
          </Text>
          {props.isMine && <MessageIndicator />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  msgBox: {
    minWidth: '30%',
    maxWidth: '80%',
    padding: 10,
    // marginTop: 16,
    borderWidth: 2,
    marginBottom: 16,
    borderRadius: 8,
    overflowWrap: 'break-word',
  },
  msg: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 8,
    fontWeight: '400',
    textAlign: 'right',
  },
});

export default Message;
