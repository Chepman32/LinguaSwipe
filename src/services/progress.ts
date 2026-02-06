import storage from './storage';
import { defaultDeckId, getDeckById } from '../data/decks';
import { nextIntervalDays, review, type Card as SrsCard } from './srs';

const KEYS = {
  settings: 'settings_v1',
  progress: 'progress_v1',
  manualRepeat: 'manual_repeat_v1',
};

export type UserSettings = {
  languageId: string;
  dailyGoal: number;
  sounds: boolean;
  haptics: boolean;
  theme: 'light' | 'dark' | 'solar' | 'mono';
};

export type CardProgress = {
  id: string;
  intervalIndex: number;
  streakKnown: number;
  lastReviewed?: number;
  lastCorrect?: boolean;
  lastResponseMs?: number;
  avgResponseMs?: number;
  lastIncorrectAt?: number;
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
  haptics: true,
  theme: 'light',
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
  const stored = await storage.get<Partial<UserSettings>>(KEYS.settings);
  return { ...defaultSettings, ...(stored ?? {}) };
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

type ManualRepeatState = {
  byLanguage: Record<string, string[]>;
};

async function getManualRepeatState(): Promise<ManualRepeatState> {
  const stored = await storage.get<ManualRepeatState>(KEYS.manualRepeat);
  return stored ?? { byLanguage: {} };
}

async function setManualRepeatState(next: ManualRepeatState) {
  await storage.set(KEYS.manualRepeat, next);
}

export async function isManuallyInRepeatList(languageId: string, cardId: string) {
  const state = await getManualRepeatState();
  return Boolean(state.byLanguage[languageId]?.includes(cardId));
}

export async function toggleManualRepeat(languageId: string, cardId: string) {
  const state = await getManualRepeatState();
  const list = state.byLanguage[languageId] ?? [];
  const next = list.includes(cardId) ? list.filter((id) => id !== cardId) : [...list, cardId];
  state.byLanguage[languageId] = next;
  await setManualRepeatState(state);
  return next.includes(cardId);
}

async function getManualRepeatIds(languageId: string) {
  const state = await getManualRepeatState();
  return new Set(state.byLanguage[languageId] ?? []);
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
  const nextSeenCount = (prev?.seenCount ?? 0) + 1;
  const prevAvg = prev?.avgResponseMs;
  const nextAvgResponseMs =
    prevAvg == null ? responseMs : Math.round((prevAvg * (nextSeenCount - 1) + responseMs) / nextSeenCount);
  const nextProgress: CardProgress = {
    id: card.id,
    intervalIndex: updated.intervalIndex,
    streakKnown: updated.streakKnown,
    lastReviewed: updated.lastReviewed,
    lastCorrect: correct,
    lastResponseMs: responseMs,
    avgResponseMs: nextAvgResponseMs,
    lastIncorrectAt: correct ? prev?.lastIncorrectAt : Date.now(),
    seenCount: nextSeenCount,
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

export type WordToRepeat = {
  id: string;
  term: string;
  translation: string;
  imageUrl: string;
  due: boolean;
  score: number; // 0..100
  reasons: string[];
  pinned?: boolean;
  progress?: CardProgress;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function daysBetweenMs(ms: number) {
  return ms / (24 * 60 * 60 * 1000);
}

export async function getWordsToRepeat(languageId: string, limit = 50): Promise<WordToRepeat[]> {
  const deck = getDeckById(languageId);
  const state = await getProgressState();
  const lang = state.byLanguage[languageId] ?? emptyLanguageProgress(languageId);
  const now = Date.now();
  const manualIds = await getManualRepeatIds(languageId);

  const items: WordToRepeat[] = [];

  for (const card of deck.cards) {
    const progress = lang.progressById[card.id];
    if (!progress) continue;

    const intervalDays = nextIntervalDays(progress.intervalIndex);
    const dueAt = (progress.lastReviewed ?? 0) + intervalDays * 24 * 60 * 60 * 1000;
    const overdueMs = now - dueAt;
    const overdueDays = overdueMs > 0 ? daysBetweenMs(overdueMs) : 0;
    const due = !progress.lastReviewed || dueAt <= now;

    const seen = Math.max(1, progress.seenCount);
    const accuracy = progress.correctCount / seen; // 0..1
    const errorRate = progress.incorrectCount / seen; // 0..1
    const streakNorm = clamp(progress.streakKnown / 3, 0, 1);
    const intervalNorm = clamp(progress.intervalIndex / 5, 0, 1); // intervals.length-1 === 5 in srs.ts
    const avgMs = progress.avgResponseMs ?? progress.lastResponseMs ?? 0;
    const speedFactor = avgMs ? clamp((avgMs - 2500) / 2500, 0, 1) : 0;
    const exposureFactor = clamp(1 / Math.sqrt(seen), 0, 1);

    const daysSinceIncorrect = progress.lastIncorrectAt ? daysBetweenMs(now - progress.lastIncorrectAt) : Infinity;
    const recentIncorrectFactor = daysSinceIncorrect === Infinity ? 0 : clamp(Math.exp(-daysSinceIncorrect / 3), 0, 1);

    // "AI-like" forgetting-risk model (heuristic features -> probability).
    // The intent is predictable behavior, not perfect science.
    const feature =
      1.6 * clamp(overdueDays / 2, 0, 2) + // overdue matters a lot
      2.0 * errorRate + // repeated mistakes
      1.1 * (1 - streakNorm) + // no streak yet
      0.9 * (1 - intervalNorm) + // early intervals = less stable memory
      0.7 * speedFactor + // slow recall = fragile memory
      0.6 * recentIncorrectFactor + // recent failure is a strong signal
      0.4 * exposureFactor; // low exposure

    const baseProb = sigmoid(feature - 1.25);
    let score = Math.round(baseProb * 100);
    if (due) score = Math.min(100, score + 10);

    const reasons: string[] = [];
    if (due) reasons.push(overdueDays >= 1 ? `Overdue ${Math.round(overdueDays)}d` : 'Due now');
    if (progress.lastCorrect === false) reasons.push('Last attempt was wrong');
    if (accuracy < 0.7) reasons.push(`Low accuracy (${Math.round(accuracy * 100)}%)`);
    if (progress.incorrectCount >= 2) reasons.push(`${progress.incorrectCount} mistakes`);
    if (speedFactor > 0.2) reasons.push('Slow recall');
    if (progress.streakKnown === 0) reasons.push('No streak yet');
    const pinned = manualIds.has(card.id);
    if (pinned) reasons.unshift('Pinned');

    // Only show words that are likely to matter: due now, recently failed, or generally error-prone.
    const isRepeatCandidate =
      due ||
      progress.lastCorrect === false ||
      progress.incorrectCount > 0 ||
      (progress.intervalIndex <= 1 && progress.seenCount >= 2);

    if (!isRepeatCandidate && !pinned) continue;
    if (pinned) {
      score = Math.min(100, score + 15);
      manualIds.delete(card.id);
    }

    items.push({
      id: card.id,
      term: card.term,
      translation: card.translation,
      imageUrl: card.imageUrl,
      due,
      score,
      reasons: reasons.length ? reasons : ['Keep practicing'],
      pinned,
      progress,
    });
  }

  // Add pinned words that don't have any progress yet (manual "repeat later").
  for (const id of manualIds) {
    const card = deck.cards.find((c) => c.id === id);
    if (!card) continue;
    items.push({
      id: card.id,
      term: card.term,
      translation: card.translation,
      imageUrl: card.imageUrl,
      due: true,
      score: 95,
      reasons: ['Pinned'],
      pinned: true,
    });
  }

  items.sort((a, b) => b.score - a.score);
  return items.slice(0, limit);
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
