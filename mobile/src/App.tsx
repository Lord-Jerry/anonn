import React, {useEffect} from 'react';
import {View, Linking} from 'react-native';
import {QueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import analytics from '@react-native-firebase/analytics';
import mixpanel from 'services/analytics';
import SplashScreen from 'react-native-splash-screen';

import Navigation from './navigation';
import {StoreKeys, retrieveData} from './services/asynstorage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App(): JSX.Element {
  useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('url', url);
    });
  }, []);
  useEffect(() => {
    SplashScreen.hide();
    const track = async () => {
      const id = await retrieveData(StoreKeys.id);
      const username = await retrieveData(StoreKeys.username);
      mixpanel.init();
      mixpanel.identify(id || username || '');
      await analytics().logEvent('app_open', {open: true});
    };
    track();
  }, []);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister: asyncStoragePersister}}>
      <View style={{flex: 1}}>
        <Navigation />
      </View>
    </PersistQueryClientProvider>
  );
}

export default App;
