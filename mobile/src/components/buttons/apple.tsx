import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native/';

import Text from 'components/text';
import colors from 'constant/colors';

type props = {
  onPress?: () => void;
  disabled?: boolean;
};

const AppleBtn = (props: props) => {
  return (
    <Pressable disabled={props.disabled} style={styles.button} onPress={props.onPress}>
      <Image style={styles.icon} source={require('@assets/logo/apple.png')} />
      <Text style={styles.text}>Continue with Apple</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: 8,
    width: 295,
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_dark,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 6,
    resizeMode: 'contain',
    alignSelf: 'center',
    paddingRight: 20,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.white,
  },
});

export default AppleBtn;
