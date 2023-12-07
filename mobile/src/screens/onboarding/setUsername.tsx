import React, {useState, useEffect} from 'react';
import {View, TextInput, StyleSheet, Text, Dimensions, ScrollView, ActivityIndicator} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/';

import Layout from 'components/layout';
import Button from 'components/buttons';
import colors from 'constant/colors';
import screens from 'constant/screens';
import UserService from 'services/user';
import mixpanel from 'src//services/analytics';

const {width, height} = Dimensions.get('window');

const SetProfileUsername = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [ischeckingUsername, setIsCheckingUsername] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const userService = new UserService();

  useEffect(() => {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(trimmedUsername)) {
      setIsUsernameValid(false);
      return;
    }

    const checkUsername = async () => {
      try {
        setIsCheckingUsername(true);
        const valid = await userService.checkUsernameAvailability(trimmedUsername);
        setIsUsernameValid(valid);
        setError(valid ? '' : 'Sorry, that username is already taken');
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const handler = setTimeout(checkUsername, 500);
    return () => clearTimeout(handler);
  }, [username]);

  const handleInputChange = (text: React.SetStateAction<string>) => {
    setUsername(text);
    setError('');
  };

  const handleSubmit = async () => {
    if (!isUsernameValid || loading) return;
    setLoading(true);
    const data = await userService.setUsername(username);
    mixpanel.track('set_username');
    if (data) navigation.navigate(screens.SetAvatar as never);
    setLoading(false);
  };

  return (
    <Layout showLogo imageStyle={styles.layoutLogo}>
      <ScrollView scrollEnabled={false} contentContainerStyle={styles.container} keyboardDismissMode="interactive">
        <Text style={styles.title}>Welcome to Anonn, Stranger</Text>
        <Text style={styles.description}>Quick one, please type in a username</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={handleInputChange}
            autoCorrect={false}
            // autoCompleteType="off"
            placeholder="Username"
            placeholderTextColor={colors.white}
          />
          {ischeckingUsername && <ActivityIndicator style={styles.loadingIndicator} />}
        </View>
        <Text style={[isUsernameValid ? styles.successMessage : styles.errorMessage]}>
          {isUsernameValid ? 'Cool username, good to go!' : null}
          {error ? error : null}
        </Text>
        <View></View>
        <View style={styles.buttonWrapper}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              disabled={loading || !isUsernameValid}
              textColor="primary_dark"
              backgroundColor={isUsernameValid ? 'anonn_green' : 'grey'}
              title="Continue"
              iconRight={<FontAwesomeIcon size={10} icon={faArrowRight} />}
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    marginHorizontal: width * 0.1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: height * 0.04,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  input: {
    color: colors.white,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
    width: '100%',
    marginTop: 30,
  },
  loadingIndicator: {
    marginLeft: 10,
    marginTop: 30,
  },
  successMessage: {
    marginTop: 14,
    color: colors.green,
    fontSize: 12,
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 14,
    color: colors.light_red,
    fontSize: 12,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 30,
  },
});

export default SetProfileUsername;
