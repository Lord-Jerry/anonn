import React from 'react';

import {Text, Pressable, StyleSheet} from 'react-native';

import colors from '@constant/colors';

type props = {
  title: string;
  textColor: keyof typeof colors;
  backgroundColor: keyof typeof colors;
  borderColor?: keyof typeof colors;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  disabled?: boolean;
  onPress: () => void;
};

const Btn = (props: props) => {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors[props.backgroundColor],
        },
        props.borderColor && { borderColor: colors[props.borderColor], borderWidth: 1 },
      ]}
      disabled={props.disabled}
      onPress={props.onPress}>
      {props.iconLeft ? props.iconLeft : null}
      <Text
        style={[
          styles.text,
          {color: colors[props.textColor]},
          props.iconLeft && { marginLeft: 10 },
          props.iconRight && { marginRight: 10 },
        ]}>
        {props.title}
      </Text>
      {props.iconRight ? props.iconRight : null}
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
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Btn;
