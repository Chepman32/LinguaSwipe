import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { fontFamilies } from '../theme/tokens';
import storage from '../services/storage';
import BackgroundShapes from '../components/BackgroundShapes';
import { useAppTheme } from '../theme/ThemeProvider';

export default function SplashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withSequence(withTiming(1, { duration: 400 }), withDelay(800, withTiming(0, { duration: 300 })));

    const timeout = setTimeout(() => {
      (async () => {
        try {
          const seen = await storage.getBoolean('onboarding_seen');
          const hasSettings = !!(await storage.get('settings_v1'));
          navigation.replace(seen || hasSettings ? 'Main' : 'Onboarding');
        } catch (error) {
          console.warn('Splash storage error', error);
          navigation.replace('Main');
        }
      })();
    }, 1100);
    return () => clearTimeout(timeout);
  }, [navigation, opacity, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(opacity.value, [0, 1], [0.6, 1], Extrapolate.CLAMP),
  }));

  return (
    <View style={styles.container}>
      <BackgroundShapes />
      <Animated.View style={[styles.icon, iconStyle]}>
        <Text style={styles.logoText}>🗣️</Text>
      </Animated.View>
      <Text style={styles.appName}>LinguaSwipe</Text>
      <Text style={styles.tagline}>Swipe your way to fluency.</Text>
    </View>
  );
}

const makeStyles = (colors: { background: string; text: string; muted: string; card: string }) =>
  StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  icon: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  logoText: { fontSize: 40 },
  appName: { marginTop: 16, fontSize: 24, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  tagline: { marginTop: 6, fontSize: 14, color: colors.muted, fontFamily: fontFamilies.body },
});
