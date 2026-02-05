import React from 'react';
import FastImage from 'react-native-fast-image';

import { getDeckById } from '../data/decks';
import { getImageCandidates } from '../utils/imageSources';

type Props = {
  languageId: string;
  active: boolean;
  onProgress?: (completed: number, total: number) => void;
  onDone?: (result: { completed: number; total: number; failed: number }) => void;
};

export default function LanguageImageDownloader({ languageId, active, onProgress, onDone }: Props) {
  const items = React.useMemo(() => {
    const deck = getDeckById(languageId);
    return deck.cards.map((card) => ({
      cardId: card.id,
      candidates: getImageCandidates(card.imageUrl),
    }));
  }, [languageId]);

  const total = items.length;

  const [itemIndex, setItemIndex] = React.useState(0);
  const [candidateIndex, setCandidateIndex] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [failed, setFailed] = React.useState(0);
  const doneCalledRef = React.useRef(false);

  React.useEffect(() => {
    doneCalledRef.current = false;
    setItemIndex(0);
    setCandidateIndex(0);
    setCompleted(0);
    setFailed(0);
  }, [languageId]);

  React.useEffect(() => {
    onProgress?.(completed, total);
  }, [completed, total, onProgress]);

  React.useEffect(() => {
    if (!active) return;
    if (completed !== total) return;
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    onDone?.({ completed, total, failed });
  }, [active, completed, failed, total, onDone]);

  React.useEffect(() => {
    if (!active) return;
    if (!total) return;
    if (itemIndex >= total) return;
    const nextCandidates = items[itemIndex]?.candidates ?? [];
    if (nextCandidates.length) return;
    // No candidates => skip the item to avoid getting stuck.
    setItemIndex((prev) => prev + 1);
    setCandidateIndex(0);
    setCompleted((prev) => prev + 1);
    setFailed((prev) => prev + 1);
  }, [active, itemIndex, items, total]);

  const candidates = active && itemIndex < total ? items[itemIndex]?.candidates ?? [] : [];
  const uri = candidates[candidateIndex];

  if (!active) return null;
  if (!total) return null;
  if (itemIndex >= total) return null;
  if (!uri) return null;

  const handleItemDone = (success: boolean) => {
    setItemIndex((prev) => prev + 1);
    setCandidateIndex(0);
    setCompleted((prev) => prev + 1);
    if (!success) setFailed((prev) => prev + 1);
  };

  const handleError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((prev) => prev + 1);
      return;
    }
    handleItemDone(false);
  };

  return (
    <FastImage
      key={`${items[itemIndex].cardId}:${candidateIndex}`}
      source={{
        uri,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable,
      }}
      style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      resizeMode={FastImage.resizeMode.cover}
      onLoad={() => handleItemDone(true)}
      onError={handleError}
    />
  );
}
