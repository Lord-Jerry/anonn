import {useEffect} from 'react';
import {Platform} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import PushNotification from 'react-native-push-notification';
import {getConversationsQueryKey, getMessagesQueryKey} from '../constant/querykeys';
import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

const useNotification = () => {
  const queryClient = useQueryClient();
  const queryKey = getConversationsQueryKey();

  const handleDataRefresh = async (conversationId: string) => {
    const messageQuerykey = getMessagesQueryKey(conversationId);
    await queryClient.invalidateQueries({
      type: 'all',
      queryKey,
    });
    await queryClient.invalidateQueries({
      type: 'all',
      queryKey: messageQuerykey,
    });
  };
  useEffect(() => {
    createNotificationChannel();

    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      // console.log('foregorund');
      // @ts-expect-error
      await handleDataRefresh(remoteMessage.data.conversationId);
      showLocalNotification(remoteMessage);
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // console.log('backgroiuns');
      // @ts-expect-error
      await handleDataRefresh(remoteMessage.data.conversationId);
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
        channelDescription: 'A default channel for notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
        playSound: true,
      },
      created => console.log(`createChannel 'default-channel-id' returned '${created}'`),
    );
  }
};

const showLocalNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  const {notification} = remoteMessage;
  if (notification) {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: notification.title,
      message: notification.body || '',
    });
  }
};

export default useNotification;
