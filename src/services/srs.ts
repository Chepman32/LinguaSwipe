export type Card = {
  id: string;
  term: string;
  translation: string;
  intervalIndex: number; // 0..N
  lastReviewed?: number;
  streakKnown: number;
};

const intervals = [1, 3, 7, 14, 30, 90]; // days

export function nextIntervalDays(intervalIndex: number) {
  return intervals[Math.min(intervalIndex, intervals.length - 1)];
}

export function review(card: Card, correct: boolean, responseMs: number): Card {
  let idx = card.intervalIndex;
  let streak = card.streakKnown;
  if (correct) {
    streak += 1;
    if (streak >= 3) idx += responseMs < 2500 ? 1 : 0; // simple difficulty proxy
  } else {
    streak = 0;
    idx = Math.max(0, idx - 1);
  }
  return {
    ...card,
    intervalIndex: Math.max(0, Math.min(idx, intervals.length - 1)),
    streakKnown: streak,
    lastReviewed: Date.now(),
  };
}
