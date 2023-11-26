import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable, Image} from 'react-native';

import Text from 'components/text';
import screens from 'constant/screens';
import colors from '../constant/colors';
import {IConversation} from '../types/conversation';
import {formatMessageTimestamp} from '../utils/time';

const ConversationItem = (prop: IConversation & {index: number}) => {
  const navigation = useNavigation();
  const handleNavigation = () => {
    navigation.navigate(screens.Message, prop);
  };
  return (
    <Pressable onPress={handleNavigation} style={styles.conversationItem}>
      <Image
        source={{uri: prop.avatar}}
        style={[
          styles.avatar,
          prop.hasNewMessage && styles.unreadIndicatorImage,
        ]}
      />
      <View style={styles.conversationDetails}>
        <View style={styles.conversationText}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[
              styles.conversationName,
              prop.hasNewMessage && styles.unreadIndicator,
            ]}>
            {prop.title}
          </Text>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[
              styles.lastMessage,
              prop.hasNewMessage && styles.unreadIndicator,
            ]}>
            {prop.lastMessage.content}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            prop.hasNewMessage && styles.unreadIndicator,
          ]}>
          {formatMessageTimestamp(prop.lastMessage.sentAt)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  conversationItem: {
    flexDirection: 'row',
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  conversationText: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  conversationDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes the timestamp to the end
  },
  conversationName: {
    color: '#fff',
    fontSize: 18,
  },
  unreadIndicator: {
    color: colors.anonn_green,
    fontWeight: 'bold',
  },
  unreadIndicatorImage: {
    borderWidth: 2,
    borderColor: colors.anonn_green,
  },
  lastMessage: {
    flexShrink: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginTop: 4,
  },
});

export default ConversationItem;
