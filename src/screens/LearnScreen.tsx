import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import SwipeCard from '../components/SwipeCard';
import { CheckIcon, CloseIcon } from '../assets/icons';
import { getSettings, getStudyQueue, recordReview } from '../services/progress';
import type { StudyCard } from '../services/progress';
import { useAppTheme } from '../theme/ThemeProvider';

export default function LearnScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const [queue, setQueue] = useState<StudyCard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [languageId, setLanguageId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const startRef = useRef<number>(Date.now());

  const loadQueue = useCallback(async () => {
    setLoading(true);
    const settings = await getSettings();
    const list = await getStudyQueue(settings.languageId, settings.dailyGoal);
    setQueue(list);
    setIndex(0);
    setLanguageId(settings.languageId);
    setCompleted(false);
    setEmpty(list.length === 0);
    setSessionKey((prev) => prev + 1);
    startRef.current = Date.now();
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    if (queue.length && !queue[index]) {
      setIndex(0);
    }
  }, [queue, index]);

  useFocusEffect(
    useCallback(() => {
      loadQueue();
    }, [loadQueue]),
  );

  const handleSwipe = async (direction: 'known' | 'again') => {
    const current = queue[index];
    if (!current) return;
    const responseMs = Date.now() - startRef.current;
    const extra = direction === 'again' ? 1 : 0;
    if (direction === 'again') {
      setQueue((prev) => [...prev, current]);
    }

    const nextIndex = index + 1;
    if (nextIndex >= queue.length + extra) {
      setCompleted(true);
    } else {
      setCompleted(false);
      setIndex(nextIndex);
      startRef.current = Date.now();
    }

    // Persist in background so UI never stalls if storage fails.
    recordReview(languageId, current, direction === 'known', responseMs).catch((error) => {
      console.warn('recordReview failed', error);
    });
  };

  const current = queue[index];
  const progress = queue.length ? Math.round(((index + (completed ? 1 : 0)) / queue.length) * 100) : 0;
  const stepLabel = queue.length ? `${index + 1} / ${queue.length}` : '0 / 0';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.closeBtn}>
          <CloseIcon color={colors.text} />
        </Pressable>
        <View>
          <Text style={styles.kicker}>Session</Text>
          <Text style={styles.title}>{stepLabel}</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : completed ? (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>Session complete</Text>
          <Text style={styles.doneText}>You reviewed {queue.length} cards. Keep the streak alive!</Text>
          <Pressable style={styles.primaryBtn} onPress={loadQueue}>
            <Text style={styles.primaryText}>Start another session</Text>
          </Pressable>
        </View>
      ) : empty ? (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>Nothing due right now</Text>
          <Text style={styles.doneText}>Come back later or switch decks in settings.</Text>
        </View>
      ) : current ? (
        <>
          <SwipeCard key={`${sessionKey}-${current.id}`} term={current.term} translation={current.translation} imageUrl={current.imageUrl} onSwipe={handleSwipe} />
          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, styles.againBtn]} onPress={() => handleSwipe('again')}>
              <CloseIcon color={colors.danger} />
              <Text style={styles.actionText}>Again</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.knowBtn]} onPress={() => handleSwipe('known')}>
              <CheckIcon color={colors.success} />
              <Text style={styles.actionText}>Know it</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>Nothing due right now</Text>
          <Text style={styles.doneText}>Come back later or switch decks in settings.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (colors: {
  background: string;
  card: string;
  muted: string;
  text: string;
  primaryDark: string;
  primary: string;
  danger: string;
  success: string;
}) =>
  StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  kicker: { fontSize: 12, color: colors.muted, fontFamily: fontFamilies.body },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  progressPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#E9EDFB' },
  progressText: { color: colors.primaryDark, fontWeight: '700', fontFamily: fontFamilies.heading },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actions: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.md, justifyContent: 'center' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  againBtn: { borderWidth: 1, borderColor: '#F6C6C8' },
  knowBtn: { borderWidth: 1, borderColor: '#BFE8D2' },
  actionText: { fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  doneCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    padding: spacing.xl,
    borderRadius: radii.xl,
    ...shadows.soft,
    alignItems: 'center',
  },
  doneTitle: { fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamilies.heading },
  doneText: { marginTop: spacing.sm, textAlign: 'center', color: colors.muted, fontFamily: fontFamilies.body },
  primaryBtn: { marginTop: spacing.lg, backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  primaryText: { color: 'white', fontWeight: '700', fontFamily: fontFamilies.heading },
});
