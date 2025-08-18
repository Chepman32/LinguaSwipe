// Lightweight in-memory DB mock for early development without native deps
type CardRow = { id: string; term: string; translation: string };
type ProgressRow = { id: string; card_id: string; interval_index: number; streak_known: number; last_reviewed: number };

const memory = {
  cards: new Map<string, CardRow>(),
  progress: new Map<string, ProgressRow>(),
};

export async function init() {
  // No-op for memory db
  return memory;
}

export default { init };
