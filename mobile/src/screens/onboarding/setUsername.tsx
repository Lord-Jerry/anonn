import React, {useState, useEffect} from 'react';
import {
  View,
  Linking,
  StyleSheet,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/';

import Layout from '@components/layout';
import Text from '@components/text';
import Input from '@components/input';
import Button from '@components/buttons';

import colors from '@constant/colors';
import screens from '@constant/screens';

const {width, height} = Dimensions.get('window');

const mockInstructions = [
  '\u2022  Keep it Anonnn!',
  '\u2022 You can add letters or numbers',
  '\u2022 You cannot change your username',
];

const UserNameInstructions = () => (
  <View style={styles.instructionsContainer}>
    <FlatList
      data={mockInstructions}
      renderItem={({item}) => (
        <View style={styles.instruction}>
          <Text style={styles.instructionText}>{item}</Text>
        </View>
      )}
    />
  </View>
);

const SetProfileUsername = () => {
  const [showButton, setShowButton] = useState(true);
  const navigation = useNavigation();

  // TODO: move this to a hook
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => setShowButton(false),
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setShowButton(true),
    );

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setShowButton(false),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setShowButton(true),
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <React.Fragment>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Anonn, </Text>
            <Text style={styles.subTitle}>Stranger</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.description}>
              Quick one, please type in a username
            </Text>

            <Input wrapperStyle={{marginTop: 30}} />
            <UserNameInstructions />
          </View>
        </View>

        {showButton && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 35,
            }}>
            <Button
              textColor="primary_dark"
              backgroundColor="anonn_green"
              title="Continue"
              iconRight={<FontAwesomeIcon size={10} icon={faArrowRight} />}
              onPress={() => navigation.navigate(screens.SetAvatar as never)}
            />
          </View>
        )}
      </React.Fragment>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layoutLogo: {
    width: 77,
    height: 22,
    marginTop: height * 0.04,
    marginBottom: height * 0.04,
    marginLeft: width * 0.1,
  },
  container: {
    flex: 1,
    // marginTop: height * 0.04,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  subTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.grey,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: height * 0.04,
  },

  instructionsContainer: {
    // height: 100,
    marginTop: 20,
    borderRadius: 8,
    padding: 15,
    backgroundColor: colors.dark_yellow_green,
    zIndex: 2,
  },
  instruction: {
    margin: 5,
  },
  instructionText: {
    color: colors.white,
    fontSize: 12,
  },
});

export default SetProfileUsername;
