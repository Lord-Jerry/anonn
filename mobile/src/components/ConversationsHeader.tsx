import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {faPaperclip, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

import avatars from 'constant/avatars';
import colors from 'constant/colors';

const ConversationsHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Image source={{uri: avatars.TU9OS0VZX09ORQ}} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <FontAwesomeIcon style={styles.iconSpacing} icon={faMagnifyingGlass} size={22} color={colors.light_grey} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faPaperclip} size={22} color={colors.light_grey} />
          </TouchableOpacity>
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
