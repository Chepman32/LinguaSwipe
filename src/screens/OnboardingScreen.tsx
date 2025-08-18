import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import storage from '../services/storage';
import { colors, spacing } from '../theme/tokens';

const { width, height } = Dimensions.get('window');

const pages = [
  { title: 'Swipe to Learn', desc: 'Right = I know, Left = I don\'t', bg: '#F0F4FF' },
  { title: 'Smart Repetition', desc: 'Spaced repetition adapts to you', bg: '#FFF7F0' },
  { title: 'Works Offline', desc: 'Learn anywhere, anytime', bg: '#F0FFF5' },
  { title: 'Pick a Language', desc: 'Start your journey now', bg: '#FFF0F3' },
];

export default function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const x = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  const dotStyle = (i: number) => useAnimatedStyle(() => ({
    width: interpolate(x.value, [(i - 1) * width, i * width, (i + 1) * width], [8, 24, 8]),
    backgroundColor: interpolate(x.value, [(i - 1) * width, i * width, (i + 1) * width], [colors.muted, colors.primary, colors.muted]) as any,
  }));

  const next = async () => {
    const idx = Math.round(x.value / width);
    if (idx >= pages.length - 1) {
      await storage.setBoolean('onboarding_seen', true);
      navigation.replace('Home');
    } else {
      scrollRef.current?.scrollTo({ x: (idx + 1) * width, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {pages.map((p, i) => (
          <View key={i} style={[styles.page, { backgroundColor: p.bg }]}> 
            <Text style={styles.title}>{p.title}</Text>
            <Text style={styles.desc}>{p.desc}</Text>
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <Animated.View key={i} style={[styles.dot, dotStyle(i)]} />
          ))}
        </View>
        <Pressable onPress={next} style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { width, height, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  desc: { marginTop: spacing.md, fontSize: 16, color: colors.muted },
  footer: { position: 'absolute', bottom: spacing.lg, left: 0, right: 0, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  dot: { height: 8, borderRadius: 4, width: 8, backgroundColor: colors.muted },
  nextBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: colors.primary },
  nextText: { color: 'white', fontWeight: '600' },
});
