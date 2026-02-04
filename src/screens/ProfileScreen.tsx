import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { CrownIcon, FlameIcon, SettingsIcon } from '../assets/icons';
import { IAP } from '../services/iap';
import { getSettings, getStats } from '../services/progress';
import { getDeckById } from '../data/decks';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ streakDays: 0, mastered: 0, accuracy: 0 });
  const [language, setLanguage] = useState('');

  const load = useCallback(async () => {
    const settings = await getSettings();
    const deck = getDeckById(settings.languageId);
    const latest = await getStats(settings.languageId);
    setStats({ streakDays: latest.streakDays, mastered: latest.mastered, accuracy: latest.accuracy });
    setLanguage(`${deck.emoji} ${deck.name}`);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Profile</Text>
          <Text style={styles.title}>Nova Learner</Text>
          <Text style={styles.subtitle}>{language}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}>
          <SettingsIcon color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>NL</Text>
        </View>
        <View>
          <Text style={styles.cardTitle}>Daily explorer</Text>
          <Text style={styles.cardMeta}>Keep your streak alive for new badges.</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <FlameIcon color={colors.accentDark} />
          <Text style={styles.badgeValue}>{stats.streakDays}d</Text>
          <Text style={styles.badgeLabel}>Streak</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeValue}>{stats.mastered}</Text>
          <Text style={styles.badgeLabel}>Mastered</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeValue}>{stats.accuracy}%</Text>
          <Text style={styles.badgeLabel}>Accuracy</Text>
        </View>
      </View>

      <View style={styles.subscription}>
        <View style={styles.subHeader}>
          <CrownIcon color={colors.accentDark} />
          <Text style={styles.subTitle}>LinguaSwipe Plus</Text>
        </View>
        <Text style={styles.subMeta}>{IAP.isPremium() ? 'Premium active' : 'Unlock unlimited decks and offline audio.'}</Text>
        <Pressable style={styles.subBtn}>
          <Text style={styles.subBtnText}>{IAP.isPremium() ? 'Manage plan' : 'Upgrade now'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.display },
  subtitle: { marginTop: 4, fontSize: 14, color: colors.textLight, fontFamily: fontFamilies.body },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.soft,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E9EDFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: colors.primaryDark, fontFamily: fontFamilies.heading },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  cardMeta: { marginTop: 4, fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body },
  badgeRow: { marginTop: spacing.lg, flexDirection: 'row', gap: spacing.md },
  badge: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.soft,
  },
  badgeValue: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  badgeLabel: { fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  subscription: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: '#FFF4E3',
  },
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  subTitle: { fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  subMeta: { marginTop: spacing.sm, fontSize: 13, color: colors.textLight, fontFamily: fontFamilies.body },
  subBtn: { marginTop: spacing.md, alignSelf: 'flex-start', backgroundColor: colors.accentDark, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  subBtnText: { color: 'white', fontWeight: '700', fontFamily: fontFamilies.heading },
});
