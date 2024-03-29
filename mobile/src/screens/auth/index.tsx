import React from 'react';
import {View, Linking, StyleSheet, Dimensions} from 'react-native';

import Layout from 'components/layout';
import colors from 'constant/colors';

import Text from 'components/text';
import GoogleBtn from 'components/buttons/google';
import AppleBtn from 'components/buttons/apple';

import useGoogleAuth from 'hooks/useGoogleAuth';
import useAppleAuth from 'hooks/useAppleAuth';

const {width, height} = Dimensions.get('window');

const Auth = () => {
  const {googleSignIn, loading: googleSignInLoading} = useGoogleAuth();
  const {appleSignIn, loading: appleSignInLoading} = useAppleAuth();

  const disableButtons = googleSignInLoading || appleSignInLoading;

  const openServiceTerms = async () => {
    const url = 'https://anonn.xyz/pages/terms';
    await Linking.openURL(url);
  };

  const openPrivacyAgreement = async () => {
    const url = 'https://anonn.xyz/pages/privacy';
    await Linking.openURL(url);
  };

  return (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <View style={styles.container}>
        <Text style={styles.title}>Continue chatting</Text>
        <Text style={styles.description}>Conntinue with your Google or Apple account</Text>

        <View style={styles.buttonContainer}>
          <GoogleBtn disabled={disableButtons} onPress={googleSignIn} />
          <AppleBtn disabled={disableButtons} onPress={appleSignIn} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you are agreeing to our</Text>
          <View style={styles.footerLinkWrapper}>
            <Text onPress={() => openServiceTerms()} style={styles.footerLink}>
              Terms of Service,
            </Text>
            <Text onPress={() => openPrivacyAgreement()} style={styles.footerLink}>
              Privacy Policy & Cookie Policy
            </Text>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layoutLogo: {
    width: 77,
    height: 22,
    marginLeft: width * 0.12,
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
  },
  footer: {
    marginTop: 30,
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
    color: colors.anonn_dark_green,
    marginTop: 5,
    marginRight: 8,
  },
});

export default Auth;
