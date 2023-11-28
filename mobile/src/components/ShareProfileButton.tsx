import colors from 'constant/colors';
import useShareProfile from 'hooks/useShareProfile';
import {faLink} from '@fortawesome/free-solid-svg-icons';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const ShareProfileButton = () => {
  const handleShareProfileLink = useShareProfile();
  return (
    <TouchableOpacity onPress={handleShareProfileLink} style={styles.button}>
      <Text style={styles.buttonText}>Share your profile link</Text>
      <FontAwesomeIcon color={colors.primary_dark} size={10} icon={faLink} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: 308,
    height: 50,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.anonn_dark_green,
  },
  buttonText: {
    fontSize: 14,
    marginRight: 10,
    textAlign: 'center',
    color: colors.primary_dark,
  },
});

export default ShareProfileButton;
