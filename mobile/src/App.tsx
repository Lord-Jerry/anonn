/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View} from 'react-native';

import Navigation from './navigation';

function App(): JSX.Element {

  return(
    <View style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}

export default App;
