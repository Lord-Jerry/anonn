import React from 'react';
import ShareProfileButton from './ShareProfileButton';
import useUserProfile from 'src//hooks/useUserProfile';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const EmptyConversation = () => {
  const {avatar} = useUserProfile();

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={{uri: avatar}} style={styles.avatar} />
      </View>
      <Text style={styles.message}>No active chats, share your profile link to kick off the conversations</Text>
      <ShareProfileButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: '80%',
    height: '80%',
    borderRadius: width * 0.5,
  },
  message: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EmptyConversation;
