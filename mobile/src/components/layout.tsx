import * as React from 'react';

import {SafeAreaView, StyleSheet, StatusBar, Image} from 'react-native';

import colors from 'constant/colors';

type props = {
  children: JSX.Element;
  showLogo?: Boolean;
  imageStyle?: {
    width: number;
    height: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
  };
};

const Layout = ({children, showLogo, imageStyle}: props) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary_dark} />
      {showLogo && <Image style={imageStyle || styles.logoStyle} source={require('@assets/logo/logo.png')} />}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary_dark,
    color: colors.white,
  },
  logoStyle: {
    width: 77,
    height: 22,
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 30,
  },
});

export default Layout;
