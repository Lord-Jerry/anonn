import React from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/';

import Text from 'components/text';

import avatars from 'constant/avatars';
import colors from 'constant/colors';

type props = {
  title: string;
};

const MessageHeader = (props: props) => {
  const navigation = useNavigation();
  const avatarKeys = Object.keys(avatars) as Array<keyof typeof avatars>;

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.header}>
      <Pressable style={styles.backBtn} onPress={handleGoBack}>
        <FontAwesomeIcon icon={faChevronLeft} color={colors.anonn_green} />
      </Pressable>

      <Image
        style={styles.avatar}
        source={{
          uri: avatars[avatarKeys[Math.floor(Math.random() * avatarKeys.length)] as never],
        }}
      />

      <Text style={styles.title}>{`@${props.title}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 10,
    borderBottomColor: colors.white,
    paddingBottom: 5,
    borderBottomWidth: 0.17,
    zIndex: 10,
    backgroundColor: colors.primary_dark,
  },
  backBtn: {
    marginTop: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 9,
  },
  avatar: {
    width: 30,
    height: 30,
    marginLeft: 40,
    marginRight: 15,
    marginTop: 0,
  },
});

export default MessageHeader;
