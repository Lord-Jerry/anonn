import * as React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';

import colors from '@constant/colors';


const Layout = ({children}: {children: JSX.Element}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={colors.primary_dark}
      />
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
});

export default Layout;
