import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { BoltIcon, CloseIcon, HeartIcon, RewindIcon, StarIcon } from '../assets/icons';
import TinderStudyCard, { type TinderStudyCardHandle } from '../components/TinderStudyCard';
import TranslationQuizModal from '../components/TranslationQuizModal';
import type { StudyCard } from '../services/progress';
import { getDeckById } from '../data/decks';
import {
  getSettings,
  getStudyQueue,
  isManuallyInRepeatList,
  recordReview,
  toggleManualRepeat,
} from '../services/progress';
import { fontFamilies, shadows, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeProvider';

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
  backgroundColor?: string;
  children: React.ReactNode;
};

const DEFAULT_ACTION_BG = 'rgba(255,255,255,0.03)';

function ActionButton({
  label,
  color,
  borderColor,
  size = 62,
  onPress,
  backgroundColor,
  children,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        staticStyles.actionBtn,
        {
          backgroundColor: backgroundColor ?? DEFAULT_ACTION_BG,
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

function shuffle<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [queue, setQueue] = useState<StudyCard[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [languageId, setLanguageId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [pinBusy, setPinBusy] = useState(false);

  const [quizVisible, setQuizVisible] = useState(false);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizForCardId, setQuizForCardId] = useState('');

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

  useEffect(() => {
    let cancelled = false;
    if (!languageId || !current?.id) {
      setPinned(false);
      return;
    }

    isManuallyInRepeatList(languageId, current.id)
      .then((value) => {
        if (!cancelled) setPinned(value);
      })
      .catch((error) => console.warn('isManuallyInRepeatList failed', error));

    return () => {
      cancelled = true;
    };
  }, [current?.id, languageId]);

  const togglePin = async () => {
    if (!languageId || !current || pinBusy) return;
    setPinBusy(true);
    try {
      const next = await toggleManualRepeat(languageId, current.id);
      setPinned(next);
    } catch (error) {
      console.warn('toggleManualRepeat failed', error);
    } finally {
      setPinBusy(false);
    }
  };

  const openQuiz = () => {
    if (!languageId || !current) return;
    const deck = getDeckById(languageId);
    const correctTranslation = current.translation;
    const pool = deck.cards.map((c) => c.translation).filter((t) => t !== correctTranslation);

    const distractors = new Set<string>();
    const shuffledPool = shuffle(pool);
    for (const t of shuffledPool) {
      distractors.add(t);
      if (distractors.size >= 3) break;
    }

    const distractorList = Array.from(distractors);
    // Ensure we always show 4 options, even if the deck has duplicates.
    for (const t of shuffledPool) {
      if (distractorList.length >= 3) break;
      distractorList.push(t);
    }

    const options = shuffle([...distractorList.slice(0, 3), correctTranslation]).slice(0, 4);
    const correctIndex = Math.max(0, options.indexOf(correctTranslation));

    setQuizForCardId(current.id);
    setQuizOptions(options);
    setQuizCorrectIndex(correctIndex);
    setQuizVisible(true);
  };

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
              id={current.id}
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
              label="Quiz"
              color="#FFB547"
              borderColor="rgba(255,181,71,0.5)"
              onPress={openQuiz}
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
              label={pinned ? 'Remove from repeat list' : 'Add to repeat list'}
              color="#2B6EF6"
              borderColor={pinned ? 'rgba(43,110,246,0.9)' : 'rgba(43,110,246,0.55)'}
              backgroundColor={pinned ? 'rgba(43,110,246,0.18)' : undefined}
              onPress={togglePin}
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

      <TranslationQuizModal
        visible={quizVisible}
        term={current?.term ?? ''}
        options={quizOptions}
        correctIndex={quizCorrectIndex}
        onRequestClose={() => setQuizVisible(false)}
        onResolved={(correct) => {
          setQuizVisible(false);
          setTimeout(() => {
            if (!current || current.id !== quizForCardId) return;
            swipe(correct ? 'known' : 'again');
          }, 220);
        }}
      />
    </SafeAreaView>
  );
}

const staticStyles = StyleSheet.create({
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});

const makeStyles = (colors: { ink: string }) =>
  StyleSheet.create({
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
});
