import React from 'react';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import colors from 'constant/colors';
import screens from '../constant/screens';
import {IConversation} from '../types/conversation';
import {useNavigation} from '@react-navigation/native';

const ProfileHeaderDarkMode = (props: IConversation) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(screens.Conversation)}>
        <FontAwesomeIcon style={styles.iconStyle} icon={faChevronLeft} size={25} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileContainer}>
        <Image source={{uri: props.avatar}} style={styles.profileImage} />
        <Text style={styles.profileName}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 0,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  iconStyle: {
    marginBottom: 40,
    marginLeft: 10,
  },
  profileImage: {
    marginTop: 10, // Adjust spacing as necessary
    width: 50, // Adjust size as necessary
    height: 50, // Adjust size as necessary
    borderRadius: 35, // Half the width/height to make it circular
    borderColor: colors.anonn_green, // Color for the border
    borderWidth: 2, // Adjust border width as necessary
  },
  profileName: {
    color: '#fff', // Text color for dark mode
    fontSize: 20, // Adjust font size as necessary
    marginTop: 10, // Adjust spacing as necessary
    fontWeight: '500',
  },
  // Add styles for any other elements
});

export default ProfileHeaderDarkMode;
