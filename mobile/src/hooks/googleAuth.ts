import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import AuthService from '@services/auth';
import {getAuthScreen } from '@utils/auth'

import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID
} from '@config/index';

const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const authService = new AuthService();
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        // @ts-ignore
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
      });

      const userInfo = await GoogleSignin.signIn();
      const data = await authService.authenticate(
        userInfo.idToken as string,
        'google',
      );

      const nextScreen = getAuthScreen(data);
      navigation.navigate(nextScreen as never);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {googleSignIn, loading};
};

export default useGoogleAuth;
