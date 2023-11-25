import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEnvelope, faHandsBubbles} from '@fortawesome/free-solid-svg-icons';
import colors from '../constant/colors';

const MessageRequestsHeader = () => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faHandsBubbles} size={24} color={colors.white} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>New Message requests</Text>
        {/* <Text style={styles.subtitle}>1 pending request</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000', // Dark background
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    color: colors.white, // White text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)', // Lighter text color for subtitles
    fontSize: 14,
  },
});

export default MessageRequestsHeader;
