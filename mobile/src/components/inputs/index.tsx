import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp} from 'react-native';
import colors from 'constant/colors';

const Input = (props: TextInputProps & {wrapperStyle?: StyleProp<ViewStyle>; iconLeft?: JSX.Element}) => {
  return (
    <View style={[styles.inputWrapper, props.wrapperStyle]}>
      {props.iconLeft}
      <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor={colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'black',
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  input: {
    color: colors.white,
    fontWeight: '400',
  },
});

export default Input;
