import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { BoltIcon, FlameIcon, SettingsIcon } from '../assets/icons';
import HeroScene from '../assets/illustrations/HeroScene';
import BackgroundShapes from '../components/BackgroundShapes';
import DeckIcon from '../components/DeckIcon';
import ProgressRing from '../components/ProgressRing';
import StatTile from '../components/StatTile';
import { getDeckById } from '../data/decks';
import { getSettings, getStats, getWeeklyReviewCounts } from '../services/progress';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';

export default function ReviewScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ reviewedToday: 0, mastered: 0, accuracy: 0, dueCount: 0, totalCards: 0, streakDays: 0 });
  const [weekly, setWeekly] = useState<{ date: string; count: number }[]>([]);
  const [dailyGoal, setDailyGoal] = useState(12);
  const [languageName, setLanguageName] = useState('');
  const [languageId, setLanguageId] = useState('');

  const load = useCallback(async () => {
    const settings = await getSettings();
    const deck = getDeckById(settings.languageId);
    const latest = await getStats(settings.languageId);
    const week = await getWeeklyReviewCounts(settings.languageId);
    setStats(latest);
    setWeekly(week);
    setDailyGoal(settings.dailyGoal);
    setLanguageName(deck.name);
    setLanguageId(settings.languageId);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const progressPercent = Math.min(100, Math.round((stats.reviewedToday / Math.max(1, dailyGoal)) * 100));
  const maxWeek = Math.max(1, ...weekly.map((d) => d.count));

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundShapes />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Welcome back</Text>
            <Text style={styles.title}>Daily practice</Text>
            <View style={styles.subtitleRow}>
              <DeckIcon deckId={languageId} size={20} />
              <Text style={styles.subtitle}>{languageName}</Text>
            </View>
          </View>
          <Pressable onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
            <SettingsIcon color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <HeroScene width={300} height={200} />
          <View style={styles.heroFooter}>
            <View>
              <Text style={styles.heroTitle}>Today&apos;s goal</Text>
              <Text style={styles.heroMeta}>
                {stats.reviewedToday} of {dailyGoal} cards
              </Text>
              <Text style={styles.heroHint}>{stats.dueCount} cards due now</Text>
            </View>
            <View style={styles.ringWrap}>
              <ProgressRing size={80} stroke={8} progress={progressPercent} color={colors.primary} bg={colors.border} />
              <Text style={styles.ringText}>{progressPercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.primaryText}>Start session</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.secondaryText}>Change deck</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatTile
            label="Streak"
            value={`${stats.streakDays}d`}
            accent={colors.accent}
            icon={<FlameIcon size={18} color={colors.accentDark} />}
          />
          <StatTile
            label="Accuracy"
            value={`${stats.accuracy}%`}
            accent={colors.success}
            icon={<BoltIcon size={18} color={colors.success} />}
          />
        </View>
        <View style={styles.statsRow}>
          <StatTile label="Due today" value={stats.dueCount} accent={colors.primary} />
          <StatTile label="Mastered" value={stats.mastered} accent={colors.info} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last 7 days</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartRow}>
              {weekly.map((day) => (
                <View key={day.date} style={styles.barWrap}>
                  <View style={[styles.bar, { height: Math.max(8, (day.count / maxWeek) * 120) }]} />
                  <Text style={styles.barLabel}>{day.date.slice(8)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatTile label="Total cards" value={stats.totalCards} accent={colors.primary} />
          <StatTile label="Mastered" value={stats.mastered} accent={colors.info} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.display },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.textLight, fontFamily: fontFamilies.body },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  heroCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.medium,
  },
  heroFooter: { marginTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  heroMeta: { marginTop: 4, fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body },
  heroHint: { marginTop: 6, fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', fontSize: 13, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
  primaryBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  primaryText: { color: 'white', fontSize: 16, fontWeight: '700', fontFamily: fontFamilies.heading },
  secondaryBtn: { backgroundColor: '#E9EDFB', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  secondaryText: { color: colors.primaryDark, fontSize: 15, fontWeight: '700', fontFamily: fontFamilies.heading },
  statsRow: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.md },

  section: { marginTop: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  chartCard: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  barWrap: { alignItems: 'center', flex: 1 },
  bar: {
    width: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  barLabel: { marginTop: 6, fontSize: 11, color: colors.muted, fontFamily: fontFamilies.body },
});

