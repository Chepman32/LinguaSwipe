import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/tokens';
import { HomeIcon, ChartIcon, ProfileIcon } from '../assets/icons';
import OfflineLanguagePackDownloader from '../components/OfflineLanguagePackDownloader';

export type MainTabParamList = {
  Home: undefined;
  Review: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 74,
            paddingTop: 10,
            paddingBottom: 14,
            borderTopColor: 'rgba(255,255,255,0.08)',
            backgroundColor: colors.ink,
          },
          tabBarActiveTintColor: colors.danger,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case 'Home':
                return <HomeIcon size={size} color={color} />;
              case 'Review':
                return <ChartIcon size={size} color={color} />;
              case 'Profile':
                return <ProfileIcon size={size} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Review" component={ReviewScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <OfflineLanguagePackDownloader />
    </>
  );
}
