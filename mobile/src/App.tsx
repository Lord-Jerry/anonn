import React from 'react';
import {View} from 'react-native';
import {QueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';

import Navigation from './navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function App(): JSX.Element {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{persister: asyncStoragePersister}}>
      <View style={{flex: 1}}>
        <Navigation />
      </View>
    </PersistQueryClientProvider>
  );
}

export default App;
