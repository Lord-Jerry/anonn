import React from 'react';

import {Text, Pressable, StyleSheet} from 'react-native';

import colors from '@constant/colors';

type props = {
  title: string;
  textColor: keyof typeof colors;
  backgroundColor: keyof typeof colors;
};

const Btn = (props: props) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors[props.backgroundColor],
        },
      ]}>
      <Text style={[styles.text, {color: colors[props.textColor]}]}>
        {props.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: 308,
    height: 50,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Btn;
