import {useEffect} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

const useNotification = () => {
  useEffect(() => {
    // Create a channel (for Android 8.0 (Oreo) and above)
    createNotificationChannel();

    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message arrived (Foreground)!',
        JSON.stringify(remoteMessage),
        Platform.OS,
      );
      showLocalNotification(remoteMessage);
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'A new FCM message arrived (Background)!',
        JSON.stringify(remoteMessage),
        Platform.OS,
      );
    });

    return unsubscribeForeground;
  }, []);
};

const createNotificationChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for notifications', // replace with your channel description
        soundName: 'default', // optional, see `soundName` parameter of `localNotification` function
        importance: 4, // optional, see `importance` parameter of `createChannel` function
        vibrate: true, // optional, see `vibrate` parameter of `createChannel` function
      },
      created =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // optional callback returns whether the channel was created successfully
    );
  }
};

const showLocalNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  const {notification} = remoteMessage;
  if (notification) {
    PushNotification.localNotification({
      channelId: 'default-channel-id', // match the channel id you set in createNotificationChannel
      title: notification.title,
      message: notification.body || '',
      // Other properties can be added here as needed
    });
  }
};

export default useNotification;
