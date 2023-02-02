import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthScreen from '@screens/auth';
import OnboardingScreen from '@screens/onboarding';
import SetProfileUsername from '@screens/onboarding/setUsername';
import SetProfileAvatar from '@screens/onboarding/setAvatar';
import ProfileSetupComplete from '@screens/onboarding/completed';

import screens from '@constant/screens';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={screens.Onboarding}
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screens.Signup}
          component={AuthScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screens.Login}
          component={AuthScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screens.SetUsername}
          component={SetProfileUsername}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screens.SetAvatar}
          component={SetProfileAvatar}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={screens.ProfileSetupcomplete}
          component={ProfileSetupComplete}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
