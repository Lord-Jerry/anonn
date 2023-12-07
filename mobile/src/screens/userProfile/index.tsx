import React from 'react';
import {queryClient} from 'src//App';
import colors from 'constant/colors';
import Layout from 'components/layout';
import screens from 'constant/screens';
import mixpanel from 'services/analytics';
import {getAuthScreen} from 'src//utils/auth';
import {clearData} from 'services/asynstorage';
import useUserProfile from 'hooks/useUserProfile';
import {useNavigation} from '@react-navigation/native';
import ShareProfileButton from 'components/ShareProfileButton';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

const {width} = Dimensions.get('window');

const UserProfile = () => {
  const {avatar, username} = useUserProfile();
  const navigation = useNavigation();

  const handleGoBack = async () => {
    const screen = await getAuthScreen();
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    await clearData();
    queryClient.clear();
    mixpanel.track('logout');
    navigation.navigate(screens.Onboarding);
  };

  const handleDeleteAccount = () => {
    handleLogout();
    // Implement delete account functionality
  };

  return (
    <Layout>
      <>
        <View>
          <TouchableOpacity onPress={handleGoBack}>
            <FontAwesomeIcon style={styles.iconStyle} icon={faChevronLeft} size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: avatar}} style={styles.avatar} />
          </View>
          <Text style={styles.username}>@{username}</Text>

          <ShareProfileButton />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount}>
            <Text style={styles.deleteAccountbutton}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#888',
    fontSize: 18,
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    marginBottom: 40,
    borderRadius: 100,
    borderColor: colors.anonn_green,
  },
  iconStyle: {
    marginBottom: 40,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  logoutButton: {
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 15,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteAccountbutton: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  deleteButtonText: {
    fontSize: 16,
    color: '#c5364c',
  },
});

export default UserProfile;
