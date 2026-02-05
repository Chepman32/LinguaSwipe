import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { BoltIcon, CloseIcon, HeartIcon, RewindIcon, StarIcon } from '../assets/icons';
import TinderStudyCard, { type TinderStudyCardHandle } from '../components/TinderStudyCard';
import type { StudyCard } from '../services/progress';
import { getSettings, getStudyQueue, recordReview } from '../services/progress';
import { colors, fontFamilies, shadows, spacing } from '../theme/tokens';

type HistoryEntry = {
  indexBefore: number;
  appended: boolean;
};

type ActionButtonProps = {
  label: string;
  color: string;
  borderColor: string;
  size?: number;
  onPress: () => void;
  children: React.ReactNode;
};

function ActionButton({ label, color, borderColor, size = 62, onPress, children }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

export default function HomeScreen() {
  const [queue, setQueue] = useState<StudyCard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [languageId, setLanguageId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const startRef = useRef<number>(Date.now());
  const historyRef = useRef<HistoryEntry[]>([]);
  const cardRef = useRef<TinderStudyCardHandle>(null);

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
    historyRef.current = [];
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useFocusEffect(
    useCallback(() => {
      loadQueue();
    }, [loadQueue]),
  );

  const handleSwipe = async (direction: 'known' | 'again') => {
    const current = queue[index];
    if (!current) return;

    const responseMs = Date.now() - startRef.current;
    const appended = direction === 'again';
    historyRef.current.push({ indexBefore: index, appended });

    if (appended) {
      setQueue((prev) => [...prev, current]);
    }

    const extra = appended ? 1 : 0;
    const nextIndex = index + 1;

    if (nextIndex >= queue.length + extra) {
      setCompleted(true);
    } else {
      setCompleted(false);
      setIndex(nextIndex);
      startRef.current = Date.now();
    }

    recordReview(languageId, current, direction === 'known', responseMs).catch((error) => {
      console.warn('recordReview failed', error);
    });
  };

  const undo = () => {
    const last = historyRef.current.pop();
    if (!last) return;

    setCompleted(false);
    setEmpty(false);

    if (last.appended) {
      setQueue((prev) => (prev.length ? prev.slice(0, -1) : prev));
    }

    setIndex(last.indexBefore);
    startRef.current = Date.now();
    setSessionKey((prev) => prev + 1);
  };

  const swipe = (direction: 'known' | 'again') => {
    cardRef.current?.swipe(direction);
  };

  const current = queue[index];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.stage}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color="rgba(255,255,255,0.9)" />
            </View>
          ) : empty ? (
            <View style={styles.centerCard}>
              <Text style={styles.centerTitle}>Nothing due right now</Text>
              <Text style={styles.centerText}>Come back later or switch decks in settings.</Text>
              <Pressable style={styles.centerBtn} onPress={loadQueue}>
                <Text style={styles.centerBtnText}>Refresh</Text>
              </Pressable>
            </View>
          ) : completed ? (
            <View style={styles.centerCard}>
              <Text style={styles.centerTitle}>Session complete</Text>
              <Text style={styles.centerText}>Nice work. Want another round?</Text>
              <Pressable style={styles.centerBtn} onPress={loadQueue}>
                <Text style={styles.centerBtnText}>Start again</Text>
              </Pressable>
            </View>
          ) : current ? (
            <TinderStudyCard
              ref={cardRef}
              key={`${sessionKey}-${current.id}`}
              term={current.term}
              translation={current.translation}
              imageUrl={current.imageUrl}
              onSwipe={handleSwipe}
            />
          ) : null}
        </View>

        {!loading && !empty && !completed && current ? (
          <View style={styles.actionsRow}>
            <ActionButton
              label="Rewind"
              color="#FFB547"
              borderColor="rgba(255,181,71,0.5)"
              onPress={undo}
              size={60}
            >
              <RewindIcon size={26} color="#FFB547" />
            </ActionButton>
            <ActionButton
              label="Again"
              color="#E5484D"
              borderColor="rgba(229,72,77,0.55)"
              onPress={() => swipe('again')}
              size={64}
            >
              <CloseIcon size={26} color="#E5484D" />
            </ActionButton>
            <ActionButton
              label="Star"
              color="#2B6EF6"
              borderColor="rgba(43,110,246,0.55)"
              onPress={() => swipe('known')}
              size={60}
            >
              <StarIcon size={26} color="#2B6EF6" />
            </ActionButton>
            <ActionButton
              label="Know it"
              color="#20B26B"
              borderColor="rgba(32,178,107,0.55)"
              onPress={() => swipe('known')}
              size={64}
            >
              <HeartIcon size={26} color="#20B26B" />
            </ActionButton>
            <ActionButton
              label="Boost"
              color="#B07CFF"
              borderColor="rgba(176,124,255,0.55)"
              onPress={() => swipe('known')}
              size={60}
            >
              <BoltIcon size={26} color="#B07CFF" />
            </ActionButton>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  content: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerCard: {
    width: '86%',
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    ...shadows.soft,
  },
  centerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    fontFamily: fontFamilies.display,
    textAlign: 'center',
  },
  centerText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: fontFamilies.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  centerBtn: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  centerBtnText: { color: 'white', fontWeight: '800', fontFamily: fontFamilies.heading },

  actionsRow: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});
