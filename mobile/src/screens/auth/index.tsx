import React, {useEffect} from 'react';
import {View, Linking, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Layout from '@components/layout';
import colors from '@constant/colors';

import Text from '@components/text';
import GoogleBtn from '@components/buttons/google';
import AppleBtn from '@components/buttons/apple';

import screens from '@constant/screens';

const {width, height} = Dimensions.get('window');

const Auth = () => {
  const navigation = useNavigation();

  const openServiceTerms = async () => {
    const url = 'https://anonn.xyz/pages/terms';
    await Linking.openURL(url);
  };

  const openPrivacyAgreement = async () => {
    const url = 'https://anonn.xyz/pages/privacy';
    await Linking.openURL(url);
  };

  const openUsernameScreen = () => {
    navigation.navigate(screens.SetUsername as never);
  }

  return (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <React.Fragment>
        <View style={styles.container}>
          <Text style={styles.title}>Continue chatting</Text>
          <Text style={styles.description}>
            Conntinue with your Google or Apple account
          </Text>

          <View style={styles.buttonContainer}>
            <GoogleBtn onPress={openUsernameScreen} />
            <AppleBtn onPress={openUsernameScreen} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you are agreeing to our
            </Text>
            <View style={styles.footerLinkWrapper}>
              <Text
                onPress={() => openServiceTerms()}
                style={styles.footerLink}>
                Terms of Service,
              </Text>
              <Text
                onPress={() => openPrivacyAgreement()}
                style={styles.footerLink}>
                Privacy Policy & Cookie Policy
              </Text>
            </View>
          </View>
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
    marginTop: height * 0.04,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  buttonContainer: {
    marginTop: 80,
  },
  footer: {
    marginTop: 50,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.grey,
  },
  footerLinkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.anonn_dark_green,
    marginTop: 5,
    marginRight: 8,
  },
});

export default Auth;
