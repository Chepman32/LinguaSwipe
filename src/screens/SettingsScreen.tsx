import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { SoundIcon } from '../assets/icons';
import DeckIcon from '../components/DeckIcon';
import { decks } from '../data/decks';
import { clearImageCache } from '../services/imageCache';
import { getSettings, resetProgress, updateSettings } from '../services/progress';
import { useAppTheme } from '../theme/ThemeProvider';
import { themes, type ThemeName } from '../theme/themes';

export default function SettingsScreen() {
  const { colors, setTheme, themeName } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [sounds, setSounds] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(12);
  const [languageId, setLanguageId] = useState(decks[0].id);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      setSounds(settings.sounds);
      setDailyGoal(settings.dailyGoal);
      setLanguageId(settings.languageId);
      setHaptics(settings.haptics);
    })();
  }, []);

  const onToggleSound = async (value: boolean) => {
    setSounds(value);
    await updateSettings({ sounds: value });
  };

  const onGoalChange = async (delta: number) => {
    const next = Math.min(30, Math.max(5, dailyGoal + delta));
    setDailyGoal(next);
    await updateSettings({ dailyGoal: next });
  };

  const onLanguageSelect = async (id: string) => {
    setLanguageId(id);
    await updateSettings({ languageId: id });
  };

  const onToggleHaptics = async (value: boolean) => {
    setHaptics(value);
    await updateSettings({ haptics: value });
  };

  const onClearCache = () => {
    Alert.alert('Clear cache?', 'This will remove downloaded images. The app will re-download them when needed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearImageCache().catch((error) => console.warn('clearImageCache failed', error));
        },
      },
    ]);
  };

  const onReset = () => {
    Alert.alert('Reset progress?', 'This will clear your progress for the current deck.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetProgress(languageId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your learning experience.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeGrid}>
            {(Object.keys(themes) as ThemeName[]).map((id) => {
              const t = themes[id];
              const selected = themeName === id;
              return (
                <Pressable
                  key={id}
                  style={[styles.themeCard, selected && styles.themeCardActive]}
                  onPress={() => setTheme(id)}
                >
                  <View style={styles.themeSwatchRow}>
                    <View style={[styles.themeSwatch, { backgroundColor: t.colors.background }]} />
                    <View style={[styles.themeSwatch, { backgroundColor: t.colors.card }]} />
                    <View style={[styles.themeSwatch, { backgroundColor: t.colors.primary }]} />
                  </View>
                  <Text style={styles.themeName}>{id[0].toUpperCase() + id.slice(1)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <SoundIcon color={colors.primary} />
              <Text style={styles.settingText}>Sound</Text>
            </View>
            <Switch value={sounds} onValueChange={onToggleSound} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>Haptics</Text>
            </View>
            <Switch value={haptics} onValueChange={onToggleHaptics} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingText}>Daily goal</Text>
            </View>
            <View style={styles.goalControls}>
              <Pressable style={styles.goalBtn} onPress={() => onGoalChange(-1)}>
                <Text style={styles.goalBtnText}>-</Text>
              </Pressable>
              <Text style={styles.goalValue}>{dailyGoal}</Text>
              <Pressable style={styles.goalBtn} onPress={() => onGoalChange(1)}>
                <Text style={styles.goalBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language deck</Text>
          {decks.map((deck) => (
            <Pressable key={deck.id} style={[styles.languageCard, languageId === deck.id && styles.languageCardActive]} onPress={() => onLanguageSelect(deck.id)}>
              <View style={styles.settingLabel}>
                <DeckIcon icon={deck.icon} size={28} />
                <View>
                  <Text style={styles.languageTitle}>{deck.name}</Text>
                  <Text style={styles.languageMeta}>{deck.level} · {deck.to}</Text>
                </View>
              </View>
              <View style={styles.radio}>
                {languageId === deck.id ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger zone</Text>
          <Pressable style={styles.cacheBtn} onPress={onClearCache}>
            <Text style={styles.cacheText}>Clear cache</Text>
          </Pressable>
          <Pressable style={styles.resetBtn} onPress={onReset}>
            <Text style={styles.resetText}>Reset progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: {
  background: string;
  text: string;
  muted: string;
  card: string;
  border: string;
  primary: string;
  primaryDark: string;
  danger: string;
}) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.display },
  subtitle: { marginTop: spacing.sm, fontSize: 14, color: colors.muted, fontFamily: fontFamilies.body },
  section: { marginTop: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  settingRow: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.soft,
  },
  settingLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingText: { fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamilies.heading },
  goalControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  goalBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E9EDFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalBtnText: { fontSize: 18, fontWeight: '700', color: colors.primaryDark },
  goalValue: { fontSize: 16, fontWeight: '700', color: colors.text, width: 32, textAlign: 'center' },
  themeGrid: { marginTop: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  themeCard: {
    width: '48%',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  themeCardActive: { borderColor: colors.primary, borderWidth: 2 },
  themeSwatchRow: { flexDirection: 'row', gap: 8 },
  themeSwatch: { width: 18, height: 18, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  themeName: { marginTop: spacing.sm, fontSize: 14, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.heading },
  languageCard: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageCardActive: { borderColor: colors.primary, ...shadows.soft },
  languageTitle: { fontSize: 15, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  languageMeta: { marginTop: 2, fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cacheBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  cacheText: { fontWeight: '800', color: colors.text, fontFamily: fontFamilies.heading },
  resetBtn: {
    marginTop: spacing.md,
    backgroundColor: '#FFE9EA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetText: { fontWeight: '700', color: colors.danger, fontFamily: fontFamilies.heading },
});
