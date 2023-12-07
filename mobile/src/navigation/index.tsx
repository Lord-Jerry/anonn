import React, {useState, useEffect} from 'react';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthScreen from 'screens/auth';
import OnboardingScreen from 'screens/onboarding';
import SetProfileUsername from 'screens/onboarding/setUsername';
import SetProfileAvatar from 'screens/onboarding/setAvatar';
import ProfileSetupComplete from 'screens/onboarding/completed';
import Conversation from 'screens/conversations';
import Messages from 'screens/messages';
import UserProfile from 'screens/userProfile';
import ConversationProfile from 'screens/conversationProfile';
import InitiateConversationScreen from 'screens/InitiateConversation';

import {getAuthScreen} from 'utils/auth';
import screens from 'constant/screens';
import {retrieveData, StoreKeys} from 'services/asynstorage';

const Stack = createNativeStackNavigator();

const linking = {
  config: {
    screens: {
      ConversationProfile: 'profile/:username',
    },
  },
  prefixes: ['https://anonn.xyz/'],
};

const Navigation = () => {
  const [defaultScreen, setDefaultScreen] = useState<string>();

  useEffect(() => {
    (async () => {
      const screen = await getAuthScreen();
      setDefaultScreen(screen);
    })();
  }, []);

  return (
    defaultScreen && (
      <NavigationContainer linking={linking}>
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
            name={screens.Message}
            // @ts-ignore
            component={Messages}
            options={{headerShown: false, gestureEnabled: true}}
          />
          <Stack.Screen
            name={screens.UserProfile}
            component={UserProfile}
            options={{headerShown: false, gestureEnabled: true}}
          />
          <Stack.Screen
            name={screens.ConversationProfile}
            // @ts-ignore
            component={ConversationProfile}
            options={{headerShown: false, gestureEnabled: true}}
          />

          <Stack.Screen
            name={screens.InitiateConversation}
            // @ts-ignore
            component={InitiateConversationScreen}
            options={{headerShown: false, gestureEnabled: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  );
};

export default Navigation;
