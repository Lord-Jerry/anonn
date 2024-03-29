import {useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';

import AuthService from 'services/auth';
import {getAuthScreen} from 'utils/auth';

import {APPLE_AUTH_NONCE, APPLE_AUTH_STATE, APPLE_AUTH_CLIENT_ID, APPLE_AUTH_REDIRECT_URI} from 'config/index';
import mixpanel from '../services/analytics';

const iosAuth = async () => {
  const authService = new AuthService();
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    nonce: APPLE_AUTH_NONCE,
  });

  await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  return authService.authenticate(appleAuthRequestResponse.identityToken as string, 'apple');
};

const androidAuth = async () => {
  const authService = new AuthService();
  appleAuthAndroid.configure({
    clientId: APPLE_AUTH_CLIENT_ID,
    redirectUri: APPLE_AUTH_REDIRECT_URI,
    responseType: appleAuthAndroid.ResponseType.ALL,
    scope: appleAuthAndroid.Scope.ALL,
    nonce: APPLE_AUTH_NONCE,
    state: APPLE_AUTH_STATE,
  });
  const response = await appleAuthAndroid.signIn();

  return authService.authenticate(response.id_token as string, 'apple');
};

const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);
  const isAndroid = Platform.OS === 'android';
  const navigation = useNavigation();

  const appleSignIn = async () => {
    setLoading(true);
    try {
      const user = isAndroid ? await androidAuth() : await iosAuth();
      const nextScreen = getAuthScreen({
        token: user.token,
        username: user.username,
        avatar: user.avatar,
      });
      mixpanel.identify(user.id);
      mixpanel.track('Apple Sign In');
      navigation.navigate(nextScreen as never);
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  };

  return {appleSignIn, loading};
};

export default useAppleAuth;
