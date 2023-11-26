import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const useNotification = () => {
  useEffect(() => {
    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message arrived (Foreground)!',
        JSON.stringify(remoteMessage),
      );
      showLocalNotification(remoteMessage);
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'A new FCM message arrived (Background)!',
        JSON.stringify(remoteMessage),
      );
    });

    return unsubscribeForeground;
  }, []);
};

const showLocalNotification = (remoteMessage: any) => {
  const {notification} = remoteMessage;
  if (notification) {
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
      // Other properties can be added here as needed
    });
  }
};

export default useNotification;
