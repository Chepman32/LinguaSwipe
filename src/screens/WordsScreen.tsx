import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeProvider';
import { getDeckById } from '../data/decks';
import { getSettings, getWordsToRepeat, type WordToRepeat } from '../services/progress';

export default function WordsScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [items, setItems] = useState<WordToRepeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageName, setLanguageName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const settings = await getSettings();
    const list = await getWordsToRepeat(settings.languageId, 80);
    setItems(list);
    setLanguageName(getDeckById(settings.languageId).name);
    setLoading(false);
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
        <Text style={styles.kicker}>Words</Text>
        <Text style={styles.title}>Repeat list</Text>
        <Text style={styles.subtitle}>
          AI picks words you struggled with ({languageName})
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : items.length ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <Pressable key={item.id} style={styles.row} onPress={() => undefined}>
              <FastImage
                source={{
                  uri: item.imageUrl,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.thumb}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.rowBody}>
                <View style={styles.rowTop}>
                  <Text style={styles.term} numberOfLines={1}>
                    {item.term}
                  </Text>
                  <View style={[styles.scorePill, item.due && styles.scorePillDue]}>
                    <Text style={[styles.scoreText, item.due && styles.scoreTextDue]}>{item.score}</Text>
                  </View>
                </View>
                <Text style={styles.translation} numberOfLines={1}>
                  {item.translation}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {item.reasons.join(' · ')}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing to repeat</Text>
          <Text style={styles.emptyText}>Keep swiping. Words you mark as “Again” will appear here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: {
  background: string;
  muted: string;
  text: string;
  card: string;
  border: string;
  textLight: string;
  primaryDark: string;
  danger: string;
}) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  kicker: { fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  title: { marginTop: 2, fontSize: 26, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.display },
  subtitle: { marginTop: spacing.sm, fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.md },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  thumb: { width: 56, height: 56, borderRadius: 14, backgroundColor: colors.border },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  term: { fontSize: 16, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.heading, flex: 1 },
  translation: { marginTop: 2, fontSize: 13, color: colors.textLight, fontFamily: fontFamilies.body },
  meta: { marginTop: 6, fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  scorePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E9EDFB',
  },
  scorePillDue: { backgroundColor: '#FFE9EA' },
  scoreText: { fontSize: 12, fontWeight: '900', color: colors.primaryDark, fontFamily: fontFamilies.heading },
  scoreTextDue: { color: colors.danger },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.heading, textAlign: 'center' },
  emptyText: { marginTop: spacing.sm, fontSize: 13, color: colors.muted, fontFamily: fontFamilies.body, textAlign: 'center' },
});
