import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthScreen from '@screens/auth';
import OnboardingScreen from '@screens/onboarding';
import SetProfileUsername from '@screens/onboarding/setUsername';
import SetProfileAvatar from '@screens/onboarding/setAvatar';
import ProfileSetupComplete from '@screens/onboarding/completed';
import Conversation from '@screens/conversations';
import ConversationRequest from '@screens/conversations/requests';

import {getAuthScreen} from '@utils/auth';
import screens from '@constant/screens';

import {retrieveData, StoreKeys} from '@services/asynstorage';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [defaultScreen, setDefaultScreen] = useState<string>();
  useEffect(() => {
    (async () => {
      const token = await retrieveData(StoreKeys.token);
      const username = await retrieveData(StoreKeys.username);
      const avatar = await retrieveData(StoreKeys.avatar);

      const screen = await getAuthScreen({token, username, avatar});
      setDefaultScreen(screen);
    })();
  }, []);

  return defaultScreen ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={defaultScreen}>
        <Stack.Screen name={screens.Onboarding} component={OnboardingScreen} options={{headerShown: false}} />
        <Stack.Screen name={screens.Signup} component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name={screens.Login} component={AuthScreen} options={{headerShown: false}} />
        <Stack.Screen name={screens.SetUsername} component={SetProfileUsername} options={{headerShown: false}} />
        <Stack.Screen name={screens.SetAvatar} component={SetProfileAvatar} options={{headerShown: false}} />
        <Stack.Screen
          name={screens.ProfileSetupcomplete}
          component={ProfileSetupComplete}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name={screens.Conversation}
          component={Conversation}
          options={{headerShown: false, gestureEnabled: false}}
        />

        <Stack.Screen
          name={screens.ConversationRequest}
          component={ConversationRequest}
          options={{headerShown: false, gestureEnabled: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : null;
};

export default Navigation;
