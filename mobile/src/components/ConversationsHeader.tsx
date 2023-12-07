import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

import colors from 'constant/colors';
import screens from 'constant/screens';
import Layout from 'components/layout';
import useUserProfile from '../hooks/useUserProfile';
import useShareProfile from '../hooks/useShareProfile';

const ConversationsHeader = () => {
  const {avatar} = useUserProfile();
  const navigation = useNavigation();
  const handleShareProfileLink = useShareProfile();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate(screens.UserProfile as never)}>
            <Image source={{uri: avatar}} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.iconsContainer}>
          {/* <TouchableOpacity onPress={() => navigation.navigate(screens.UserProfile as never)}>
            <Image source={{uri: avatar}} style={styles.avatar} />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 10,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
  },
  headerTitle: {
    color: colors.light_grey,
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconSpacing: {
    marginHorizontal: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default ConversationsHeader;
