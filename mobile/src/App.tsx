import React, {useEffect} from 'react';
import {View} from 'react-native';
import {QueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import analytics from '@react-native-firebase/analytics';

import Navigation from './navigation';
import useNotification from 'hooks/useNotification';

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
    analytics().logEvent('app_open', {open: true});
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
