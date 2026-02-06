import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WordsScreen from '../screens/WordsScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { BookIcon, ChartIcon, HomeIcon, ProfileIcon } from '../assets/icons';
import OfflineLanguagePackDownloader from '../components/OfflineLanguagePackDownloader';
import { useAppTheme } from '../theme/ThemeProvider';

export type MainTabParamList = {
  Home: undefined;
  Words: undefined;
  Review: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const { colors } = useAppTheme();
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
              case 'Words':
                return <BookIcon size={size} color={color} />;
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
        <Tab.Screen name="Words" component={WordsScreen} />
        <Tab.Screen name="Review" component={ReviewScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <OfflineLanguagePackDownloader />
    </>
  );
}
