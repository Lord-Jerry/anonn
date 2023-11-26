import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import UserService from '../services/user';
import messaging from '@react-native-firebase/messaging';
import {StoreKeys, retrieveData, storeData} from '../services/asynstorage';

const requestPermission = async () => {};

const useRequestNotificationPermission = () => {
  const userService = new UserService();

  useEffect(() => {
    const requestPermission = async () => {
      let status = await messaging().requestPermission();
      const notificationId = await retrieveData(StoreKeys.notificationId);
      if (Platform.OS === 'android') {
        // await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        // );
      }

      const enabled =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (
        !notificationId &&
        ((Platform.OS === 'ios' && enabled) || Platform.OS === 'android')
      ) {
        try {
          // This method is necessary for iOS, but not for Android.
          // For Android, FCM automatically handles token registration.
          if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
          }

          const token = await messaging().getToken();
          const id = await userService.upsertUserDeviceToken(token);
          await storeData(StoreKeys.notificationId, id);
        } catch (error) {
          console.error('Error getting FCM token:', error);
        }
      }
    };

    requestPermission();
  }, []);
};

export default useRequestNotificationPermission;
