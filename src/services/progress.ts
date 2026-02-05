import storage from './storage';
import { defaultDeckId, getDeckById } from '../data/decks';
import { nextIntervalDays, review, type Card as SrsCard } from './srs';

const KEYS = {
  settings: 'settings_v1',
  progress: 'progress_v1',
};

export type UserSettings = {
  languageId: string;
  dailyGoal: number;
  sounds: boolean;
};

export type CardProgress = {
  id: string;
  intervalIndex: number;
  streakKnown: number;
  lastReviewed?: number;
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
};

export type LanguageProgress = {
  languageId: string;
  progressById: Record<string, CardProgress>;
  lastStudyDate?: string;
  streakDays: number;
  totalReviews: number;
  correctReviews: number;
};

export type ProgressState = {
  byLanguage: Record<string, LanguageProgress>;
};

const defaultSettings: UserSettings = {
  languageId: defaultDeckId,
  dailyGoal: 12,
  sounds: true,
};

const emptyLanguageProgress = (languageId: string): LanguageProgress => ({
  languageId,
  progressById: {},
  lastStudyDate: undefined,
  streakDays: 0,
  totalReviews: 0,
  correctReviews: 0,
});

const dateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const isYesterday = (dateStr?: string) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toISOString().slice(0, 10) === dateKey(yesterday);
};

const isToday = (timestamp?: number) => {
  if (!timestamp) return false;
  const date = new Date(timestamp);
  return dateKey(date) === dateKey();
};

export async function getSettings(): Promise<UserSettings> {
  const stored = await storage.get<UserSettings>(KEYS.settings);
  return stored ?? defaultSettings;
}

const settingsListeners = new Set<(settings: UserSettings) => void>();

export function subscribeSettings(listener: (settings: UserSettings) => void) {
  settingsListeners.add(listener);
  return () => {
    settingsListeners.delete(listener);
  };
}

export async function updateSettings(next: Partial<UserSettings>): Promise<UserSettings> {
  const current = await getSettings();
  const merged = { ...current, ...next };
  await storage.set(KEYS.settings, merged);
  settingsListeners.forEach((listener) => listener(merged));
  return merged;
}

async function getProgressState(): Promise<ProgressState> {
  const stored = await storage.get<ProgressState>(KEYS.progress);
  return stored ?? { byLanguage: {} };
}

async function setProgressState(next: ProgressState) {
  await storage.set(KEYS.progress, next);
}

export async function ensureLanguageProgress(languageId: string) {
  const state = await getProgressState();
  if (!state.byLanguage[languageId]) {
    state.byLanguage[languageId] = emptyLanguageProgress(languageId);
    await setProgressState(state);
  }
  return state.byLanguage[languageId];
}

export type StudyCard = {
  id: string;
  term: string;
  translation: string;
  imageUrl: string;
  progress: CardProgress | undefined;
  due: boolean;
};

export async function getStudyQueue(languageId: string, limit = 10): Promise<StudyCard[]> {
  const deck = getDeckById(languageId);
  const state = await getProgressState();
  const lang = state.byLanguage[languageId] ?? emptyLanguageProgress(languageId);
  const now = Date.now();
  const cards = deck.cards.map((card) => {
    const progress = lang.progressById[card.id];
    const intervalDays = progress ? nextIntervalDays(progress.intervalIndex) : 0;
    const due = !progress?.lastReviewed || progress.lastReviewed + intervalDays * 24 * 60 * 60 * 1000 <= now;
    return { ...card, progress, due } as StudyCard;
  });

  const dueCards = cards.filter((card) => card.due && card.progress);
  const newCards = cards.filter((card) => !card.progress);
  const mixed = [...dueCards, ...newCards].slice(0, limit);

  return mixed.length ? mixed : cards.filter((card) => card.due).slice(0, limit);
}

export async function recordReview(
  languageId: string,
  card: { id: string; term: string; translation: string },
  correct: boolean,
  responseMs: number,
) {
  const state = await getProgressState();
  const lang = state.byLanguage[languageId] ?? emptyLanguageProgress(languageId);
  const prev = lang.progressById[card.id];
  const base: SrsCard = {
    id: card.id,
    term: card.term,
    translation: card.translation,
    intervalIndex: prev?.intervalIndex ?? 0,
    lastReviewed: prev?.lastReviewed,
    streakKnown: prev?.streakKnown ?? 0,
  };
  const updated = review(base, correct, responseMs);
  const nextProgress: CardProgress = {
    id: card.id,
    intervalIndex: updated.intervalIndex,
    streakKnown: updated.streakKnown,
    lastReviewed: updated.lastReviewed,
    seenCount: (prev?.seenCount ?? 0) + 1,
    correctCount: (prev?.correctCount ?? 0) + (correct ? 1 : 0),
    incorrectCount: (prev?.incorrectCount ?? 0) + (correct ? 0 : 1),
  };

  lang.progressById[card.id] = nextProgress;
  lang.totalReviews += 1;
  lang.correctReviews += correct ? 1 : 0;

  const todayKey = dateKey();
  if (lang.lastStudyDate === todayKey) {
    // no-op
  } else if (isYesterday(lang.lastStudyDate)) {
    lang.streakDays += 1;
  } else {
    lang.streakDays = 1;
  }
  lang.lastStudyDate = todayKey;

  state.byLanguage[languageId] = lang;
  await setProgressState(state);
  return nextProgress;
}

export async function getStats(languageId: string) {
  const deck = getDeckById(languageId);
  const state = await getProgressState();
  const lang = state.byLanguage[languageId] ?? emptyLanguageProgress(languageId);

  const progress = Object.values(lang.progressById);
  const reviewedToday = progress.filter((p) => isToday(p.lastReviewed)).length;
  const mastered = progress.filter((p) => p.intervalIndex >= 4).length;
  const accuracy = lang.totalReviews ? Math.round((lang.correctReviews / lang.totalReviews) * 100) : 0;
  const dueCount = deck.cards.filter((card) => {
    const p = lang.progressById[card.id];
    if (!p?.lastReviewed) return true;
    const intervalDays = nextIntervalDays(p.intervalIndex);
    return p.lastReviewed + intervalDays * 24 * 60 * 60 * 1000 <= Date.now();
  }).length;

  return {
    reviewedToday,
    mastered,
    accuracy,
    dueCount,
    totalCards: deck.cards.length,
    streakDays: lang.streakDays,
  };
}

export async function resetProgress(languageId: string) {
  const state = await getProgressState();
  state.byLanguage[languageId] = emptyLanguageProgress(languageId);
  await setProgressState(state);
}

export async function getWeeklyReviewCounts(languageId: string) {
  const state = await getProgressState();
  const lang = state.byLanguage[languageId] ?? emptyLanguageProgress(languageId);
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - idx));
    return { date: dateKey(date), count: 0 };
  });

  Object.values(lang.progressById).forEach((p) => {
    if (!p.lastReviewed) return;
    const key = dateKey(new Date(p.lastReviewed));
    const target = days.find((d) => d.date === key);
    if (target) target.count += 1;
  });

  return days;
}
