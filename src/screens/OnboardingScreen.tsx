import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import storage from '../services/storage';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import OnboardingScene from '../assets/illustrations/OnboardingScene';
import DeckIcon from '../components/DeckIcon';
import { decks } from '../data/decks';
import { updateSettings } from '../services/progress';
import { useAppTheme } from '../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const pages = [
  { title: 'Swipe to Learn', desc: 'Right = I know it. Left = Still learning.', variant: 'swipe' as const },
  { title: 'Smart Repetition', desc: 'Spaced repetition locks words in.', variant: 'repeat' as const },
  { title: 'Works Offline', desc: 'Keep your streak anywhere.', variant: 'offline' as const },
  { title: 'Pick a Language', desc: 'Choose your first deck and dive in.', variant: 'language' as const },
];

// Separate Dot component to use hooks properly at top level
function Dot({
  index,
  x,
  colors,
}: {
  index: number;
  x: Animated.SharedValue<number>;
  colors: { border: string; primary: string };
}) {
  const style = useAnimatedStyle(() => ({
    width: interpolate(x.value, [(index - 1) * width, index * width, (index + 1) * width], [8, 26, 8]),
    backgroundColor: interpolateColor(x.value, [(index - 1) * width, index * width, (index + 1) * width], [colors.border, colors.primary, colors.border]),
  }));

  return <Animated.View style={[dotStyles.dot, style]} />;
}

export default function OnboardingScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const x = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [selected, setSelected] = useState(decks[0].id);
  const [pageIndex, setPageIndex] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const seen = await storage.getBoolean('onboarding_seen');
        const hasSettings = !!(await storage.get('settings_v1'));
        if (seen || hasSettings) {
          navigation.replace('Main');
        }
      } finally {
        setChecking(false);
      }
    })();
  }, [navigation]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  const finish = async () => {
    try {
      await Promise.all([
        updateSettings({ languageId: selected }),
        storage.setBoolean('onboarding_seen', true),
      ]);
    } catch (error) {
      console.warn('Onboarding finish error', error);
    } finally {
      navigation.replace('Main');
    }
  };

  const next = async () => {
    if (pageIndex >= pages.length - 1) {
      await finish();
    } else {
      scrollRef.current?.scrollTo({ x: (pageIndex + 1) * width, animated: true });
    }
  };

  const skip = async () => {
    try {
      await storage.setBoolean('onboarding_seen', true);
    } catch (error) {
      console.warn('Onboarding skip error', error);
    } finally {
      navigation.replace('Main');
    }
  };

  if (checking) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={(event) => {
          const idx = Math.round(event.nativeEvent.contentOffset.x / width);
          setPageIndex(idx);
        }}
        scrollEventThrottle={16}
      >
        {pages.map((p, i) => (
          <View key={p.title} style={styles.page}>
            <View style={styles.hero}>
              <OnboardingScene variant={p.variant} width={260} height={200} />
            </View>
            <Text style={styles.title}>{p.title}</Text>
            <Text style={styles.desc}>{p.desc}</Text>
            {i === pages.length - 1 ? (
              <View style={styles.languageGrid}>
                {decks.map((deck) => (
                  <Pressable
                    key={deck.id}
                    onPress={() => setSelected(deck.id)}
                    style={[
                      styles.languageCard,
                      selected === deck.id && styles.languageCardActive,
                    ]}
                  >
                    <DeckIcon icon={deck.icon} size={36} />
                    <View>
                      <Text style={styles.languageName}>{deck.name}</Text>
                      <Text style={styles.languageMeta}>{deck.level} · {deck.to}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={skip} hitSlop={12} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <Dot key={i} index={i} x={x} colors={colors} />
          ))}
        </View>
        <Pressable onPress={next} style={({ pressed }) => [styles.nextBtn, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.nextText}>{pageIndex === pages.length - 1 ? 'Start' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const dotStyles = StyleSheet.create({
  dot: { height: 8, borderRadius: 4, width: 8 },
});

const makeStyles = (colors: {
  background: string;
  card: string;
  border: string;
  primary: string;
  text: string;
  muted: string;
}) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  page: { width, height, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  hero: { marginBottom: spacing.xl },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.display, textAlign: 'center' },
  desc: { marginTop: spacing.md, fontSize: 16, color: colors.muted, textAlign: 'center', fontFamily: fontFamilies.body },
  languageGrid: { marginTop: spacing.xl, gap: spacing.md, width: '100%' },
  languageCard: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  languageCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  languageName: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  languageMeta: { marginTop: 2, fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 10,
  },
  dots: { flexDirection: 'row', gap: 8 },
  nextBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary },
  nextText: { color: 'white', fontWeight: '700', fontFamily: fontFamilies.heading },
  skipBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  skipText: { color: colors.muted, fontWeight: '600', fontFamily: fontFamilies.body },
});
