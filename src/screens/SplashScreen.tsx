import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/tokens';

export default function SplashScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withSequence(withTiming(1, { duration: 400 }), withDelay(800, withTiming(0, { duration: 300 })));

    const timeout = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1200);
    return () => clearTimeout(timeout);
  }, [navigation, opacity, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(opacity.value, [0, 1], [0.6, 1], Extrapolate.CLAMP),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.icon, iconStyle]}>
        <Text style={styles.logoText}>💬</Text>
      </Animated.View>
      <Text style={styles.appName}>LinguaSwipe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  icon: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F4FF' },
  logoText: { fontSize: 48 },
  appName: { marginTop: 16, fontSize: 20, fontWeight: '600', color: colors.text },
});
