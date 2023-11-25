import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/';

import Layout from 'components/layout';
import Text from 'components/text';
import Input from 'components/inputs';
import Button from 'components/buttons';

import colors from 'constant/colors';
import screens from 'constant/screens';

import useHandleKeyboard from 'hooks/useHandlekeyboard';
import UserService from 'services/user';

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
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string>();
  const [usernameValid, setUsernameValid] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  const userService = new UserService();
  const navigation = useNavigation();
  const keyboardVisible = useHandleKeyboard();

  const checkUsernameValid = (username: string) => {
    const regex = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]*$/);
    return regex.test(username);
  };

  useEffect(() => {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || !checkUsernameValid(trimmedUsername)) {
      return;
    }

    const handler = setTimeout(async () => {
      const isUsernameValid = await userService.checkUsernameAvailability(trimmedUsername);
      setUsernameValid(isUsernameValid);
      !isUsernameValid && setError('Sorry, that username is already taken');
    }, 500);

    return () => clearTimeout(handler);
  }, [username]);

  const handleInputChange = (text: string) => {
    const username = text.trim();
    setUsername(username);
    const usernameValid = checkUsernameValid(username);
    if (!text || usernameValid) {
      setError(undefined);
      setUsernameValid(undefined);
      return;
    }

    setError('Invalid username');
    setUsernameValid(false);
  };

  const handleSubmit = async () => {
    if (!usernameValid) {
      return;
    }
    setLoading(true);

    const data = await userService.setUsername(username);
    data && navigation.navigate(screens.SetAvatar as never);
    setLoading(false);
  };

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
            <Text style={styles.description}>Quick one, please type in a username</Text>

            <Input
              autoComplete="off"
              autoCorrect={false}
              value={username}
              onChangeText={handleInputChange}
              wrapperStyle={{marginTop: 30}}
            />
            {!username && <UserNameInstructions />}
            {usernameValid !== undefined && usernameValid && (
              <Text style={styles.successMessage}>cool username, good to go!</Text>
            )}
            {error && usernameValid !== undefined && !usernameValid && <Text style={styles.errorMessage}>{error}</Text>}
          </View>
        </View>

        {!keyboardVisible && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 35,
            }}>
            <Button
              disabled={loading || !usernameValid}
              textColor="primary_dark"
              backgroundColor="anonn_green"
              title="Continue"
              iconRight={<FontAwesomeIcon size={10} icon={faArrowRight} />}
              onPress={handleSubmit}
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
  successMessage: {
    marginTop: 14,
    color: colors.green,
    fontSize: 10,
    fontWeight: '400',
  },
  errorMessage: {
    marginTop: 14,
    color: colors.light_red,
    fontSize: 10,
    fontWeight: '400',
  },
});

export default SetProfileUsername;
