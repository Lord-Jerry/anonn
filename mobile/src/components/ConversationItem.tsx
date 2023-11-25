import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Pressable, Image} from 'react-native';

import Text from 'components/text';
import screens from 'constant/screens';
import {IConversation} from '../types/conversation';

const ConversationItem = (prop: IConversation) => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate(screens.Message, prop)} style={styles.conversationItem}>
      <Image source={{uri: prop.avatar}} style={styles.avatar} />
      <View style={styles.conversationText}>
        <Text style={styles.conversationName}>{prop.title}</Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.lastMessage}>
          {prop.lastMessage.content}
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
    justifyContent: 'center',
  },
  conversationName: {
    color: '#fff',
    fontSize: 18,
  },
  lastMessage: {
    width: '75%',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});

export default ConversationItem;
