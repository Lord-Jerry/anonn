import {useEffect} from 'react';
import UserService from '../services/user';
import messaging from '@react-native-firebase/messaging';
import {StoreKeys, retrieveData, storeData} from '../services/asynstorage';

const useRequestNotificationPermission = () => {
  const userService = new UserService();
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const notificationId = await retrieveData(StoreKeys.notificationId);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log(notificationId, enabled);

      if (enabled && !notificationId) {
        // await messaging().registerDeviceForRemoteMessages();
        try {
          const token = await messaging().getToken();
          console.log(JSON.stringify({token}));
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
