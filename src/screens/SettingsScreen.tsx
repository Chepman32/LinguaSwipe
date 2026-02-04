import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { LanguageIcon, SoundIcon } from '../assets/icons';
import DeckIcon from '../components/DeckIcon';
import { decks } from '../data/decks';
import { getSettings, resetProgress, updateSettings } from '../services/progress';

export default function SettingsScreen() {
  const [sounds, setSounds] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(12);
  const [languageId, setLanguageId] = useState(decks[0].id);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      setSounds(settings.sounds);
      setDailyGoal(settings.dailyGoal);
      setLanguageId(settings.languageId);
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
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <SoundIcon color={colors.primary} />
              <Text style={styles.settingText}>Sounds</Text>
            </View>
            <Switch value={sounds} onValueChange={onToggleSound} />
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
          <Pressable style={styles.resetBtn} onPress={onReset}>
            <Text style={styles.resetText}>Reset progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  resetBtn: {
    marginTop: spacing.md,
    backgroundColor: '#FFE9EA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetText: { fontWeight: '700', color: colors.danger, fontFamily: fontFamilies.heading },
});
