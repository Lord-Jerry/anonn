import React, {useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, Image, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight, faLink} from '@fortawesome/free-solid-svg-icons/';

import Layout from '@components/layout';
import Text from '@components/text';
import Button from '@components/buttons';

import colors from '@constant/colors';
import avatars from '@constant/avatars';
import screens from '@constant/screens';

import {retrieveData, StoreKeys} from '@services/asynstorage';

const {width, height} = Dimensions.get('window');

const ProfileSetupComplete = () => {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState<keyof typeof avatars>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    retrieveData(StoreKeys.avatar).then(data => {
      data && setAvatar(data as keyof typeof avatars);
    });

    retrieveData(StoreKeys.username).then(data => {
      data && setUsername(data);
    });
  }, []);

  const handleShare = () => {
    Share.share({
      message: `https://anonn.com/profile/${username} Hey, I'm on Anonn. Let's connect and chat`,
    });
  };

  const continueHandler = () =>
    navigation.navigate(screens.Conversation as never);

  return avatar && username ? (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <React.Fragment>
        <View style={styles.container}>
          <Text style={styles.title}>Share your profile link</Text>
          <Text style={styles.subTitle}>
            Let the conversations flow, yeah...
          </Text>

          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{uri: avatars[avatar]}} />

            <Text style={styles.username}>{`@${username}`}</Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}>
            <Button
              textColor="primary_dark"
              backgroundColor="anonn_green"
              title="Share your profile link "
              iconRight={
                <FontAwesomeIcon
                  color={colors.primary_dark}
                  size={10}
                  icon={faLink}
                />
              }
              onPress={handleShare}
            />
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Button
            textColor="anonn_green"
            backgroundColor="primary_dark"
            borderColor="anonn_green"
            title="Nah, Later"
            iconRight={
              <FontAwesomeIcon
                color={colors.anonn_green}
                size={10}
                icon={faArrowRight}
              />
            }
            onPress={continueHandler}
          />
        </View>
      </React.Fragment>
    </Layout>
  ) : null;
};

const styles = StyleSheet.create({
  layoutLogo: {
    width: 77,
    height: 22,
    marginTop: height * 0.04,
    marginBottom: height * 0.04,
    marginLeft: width * 0.1,
  },
  container: {
    flex: 1,
    // marginTop: height * 0.04,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
  },
  avatarContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    marginTop: 20,
    fontSize: 21,
    fontWeight: '700',
    color: colors.white,
  },
  changeAvatarBtn: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '400',
    color: colors.grey,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  avatarOptionsContainer: {
    flex: 1,
    width: '100%',
    marginTop: 55,
    padding: 'auto',
  },
  avatarOption: {
    width: 64,
    height: 64,
    margin: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileSetupComplete;
