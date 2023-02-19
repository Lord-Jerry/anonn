import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    StyleProp,
  } from 'react-native';
  import colors from '@constant/colors';
  
  const SearchInput = (
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
      borderBottomColor: colors.light_dark,
      borderBottomWidth: 1,
    },
    input: {
      color: colors.white,
      fontWeight: '400',
    },
  });
  
  export default SearchInput;
  