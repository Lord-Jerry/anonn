import React, {useState} from 'react';
import {View, Dimensions, StyleSheet, Image, Pressable, FlatList, ScrollView} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/';

import Layout from 'components/layout';
import Text from 'components/text';
import Button from 'components/buttons';

import colors from 'constant/colors';
import avatars from 'constant/avatars';
import screens from 'constant/screens';

import UserService from 'services/user';
import mixpanel from 'src//services/analytics';

const {width, height} = Dimensions.get('window');

const SetProfileAvatar = () => {
  const avatarKeys = Object.keys(avatars) as Array<keyof typeof avatars>;
  const randomAvatar = avatarKeys[Math.floor(Math.random() * avatarKeys.length)];

  const [loading, setLoading] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<keyof typeof avatars>(randomAvatar);

  const userService = new UserService();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);

    const data = await userService.setAvatar(selectedAvatar);
    data && navigation.navigate(screens.ProfileSetupcomplete as never);
    setLoading(false);
    mixpanel.track('set_avatar');
  };

  const toogleAvatarOptions = () => setShowAvatarOptions(!showAvatarOptions);
  return (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <React.Fragment>
        <View style={styles.container}>
          <Text style={styles.title}>Set Anonn Profile</Text>
          <Text style={styles.subTitle}>Please select an avatar to continue.</Text>

          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{uri: avatars[selectedAvatar]}} />

            <Text style={styles.username}>@sillyjumper</Text>

            <Pressable style={styles.changeAvatarBtn} onPress={toogleAvatarOptions}>
              <Text style={{color: '#E3E4E5'}}> change avatar</Text>
            </Pressable>
          </View>

          {showAvatarOptions && (
            <ScrollView
              zoomScale={2}
              centerContent
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.avatarOptionsContainer}>
              <FlatList
                centerContent
                numColumns={4}
                data={avatarKeys}
                renderItem={({item}) => (
                  <Pressable onPress={() => setSelectedAvatar(item)}>
                    <Image style={styles.avatarOption} source={{uri: avatars[item]}} />
                  </Pressable>
                )}
              />
            </ScrollView>
          )}
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Button
            disabled={loading}
            textColor="primary_dark"
            backgroundColor="anonn_green"
            title="Complete"
            iconRight={<FontAwesomeIcon size={10} icon={faArrowRight} />}
            onPress={handleSubmit}
          />
        </View>
      </React.Fragment>
    </Layout>
  );
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
    marginTop: 50,
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

export default SetProfileAvatar;
