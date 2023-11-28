/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App, {queryClient} from './src/App';
import {name as appName} from './app.json';
import {getMessagesQueryKey} from 'constant/querykeys';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const messageQuerykey = getMessagesQueryKey(conversationId);
  await queryClient.invalidateQueries({
    type: 'all',
    queryKey: messageQuerykey,
  });
});

AppRegistry.registerComponent(appName, () => App);
