import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import ProgressRing from '../components/ProgressRing';
import StatTile from '../components/StatTile';
import { getSettings, getStats, getWeeklyReviewCounts } from '../services/progress';

export default function ReviewScreen() {
  const [stats, setStats] = useState({ reviewedToday: 0, mastered: 0, accuracy: 0, dueCount: 0, totalCards: 0, streakDays: 0 });
  const [weekly, setWeekly] = useState<{ date: string; count: number }[]>([]);
  const [dailyGoal, setDailyGoal] = useState(12);

  const load = useCallback(async () => {
    const settings = await getSettings();
    const latest = await getStats(settings.languageId);
    const week = await getWeeklyReviewCounts(settings.languageId);
    setStats(latest);
    setWeekly(week);
    setDailyGoal(settings.dailyGoal);
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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress review</Text>
        <Text style={styles.subtitle}>Track growth, accuracy, and weekly rhythm.</Text>

        <View style={styles.highlight}>
          <View>
            <Text style={styles.highlightTitle}>Daily goal</Text>
            <Text style={styles.highlightValue}>{stats.reviewedToday} / {dailyGoal}</Text>
            <Text style={styles.highlightMeta}>{stats.dueCount} cards due now</Text>
          </View>
          <View style={styles.ringWrap}>
            <ProgressRing size={88} stroke={8} progress={progressPercent} color={colors.accentDark} bg={colors.border} />
            <Text style={styles.ringText}>{progressPercent}%</Text>
          </View>
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
          <StatTile label="Streak" value={`${stats.streakDays}d`} accent={colors.accentDark} />
          <StatTile label="Accuracy" value={`${stats.accuracy}%`} accent={colors.success} />
        </View>
        <View style={styles.statsRow}>
          <StatTile label="Mastered" value={stats.mastered} accent={colors.info} />
          <StatTile label="Total cards" value={stats.totalCards} accent={colors.primary} />
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
  highlight: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.soft,
  },
  highlightTitle: { fontSize: 14, color: colors.muted, fontFamily: fontFamilies.body },
  highlightValue: { marginTop: 4, fontSize: 22, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  highlightMeta: { marginTop: 4, fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', fontSize: 13, fontWeight: '700', color: colors.text },
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
  statsRow: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.md },
});
