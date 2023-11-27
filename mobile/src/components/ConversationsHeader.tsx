import React, {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import {
  faPaperclip,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

import avatars from 'constant/avatars';
import colors from 'constant/colors';
import {StoreKeys, retrieveData} from 'services/asynstorage';

const ConversationsHeader = () => {
  const [avatar, setAvatar] =
    React.useState<keyof typeof avatars>('TU9OS0VZX09ORQ');
  const handleShare = async () => {
    const userProfile = await retrieveData(StoreKeys.username);
    const link = `https://anonn.xyz/profile/${userProfile}`;
    Share.share({
      message: `
      Let's chat on Anonn! \n Share your secrets, confessions and spicy gists with me anonnymously \n No one will ever know it's you! 🤫🤫🤫 \n ${link}`,
    });
  };

  useEffect(() => {
    const getAvatar = async () => {
      const avatar = (await retrieveData(
        StoreKeys.avatar,
      )) as keyof typeof avatars;
      if (avatar) {
        setAvatar(avatar);
      }
    };
    getAvatar();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Image source={{uri: avatars[avatar]}} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <FontAwesomeIcon
              style={styles.iconSpacing}
              icon={faMagnifyingGlass}
              size={22}
              color={colors.light_grey}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare}>
            <FontAwesomeIcon
              icon={faPaperclip}
              size={22}
              color={colors.light_grey}
            />
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
