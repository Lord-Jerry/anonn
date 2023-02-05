import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import colors from '@constant/colors';

const Input = (
  props: TextInputProps & {wrapperStyle?: StyleProp<ViewStyle>},
) => {
  return (
    <View style={[styles.inputWrapper, props.wrapperStyle]}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor={colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
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
