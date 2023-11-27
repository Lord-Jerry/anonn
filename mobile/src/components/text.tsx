import {Text, StyleSheet} from 'react-native';
import {TextProps} from 'react-native/types';
import colors from 'constant/colors';

const AnonnText = (props: TextProps & {children: string | JSX.Element}) => {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Quicksand',
    color: colors.white,
  },
});

export default AnonnText;
