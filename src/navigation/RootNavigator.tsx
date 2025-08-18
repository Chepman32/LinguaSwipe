import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import storage from '../services/storage';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Learn: undefined;
  Review: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Splash');

  useEffect(() => {
    (async () => {
      const seen = await storage.getBoolean('onboarding_seen');
      setInitialRoute(seen ? 'Home' : 'Onboarding');
    })();
  }, []);

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
