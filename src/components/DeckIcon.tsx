import React from 'react';
import { SpainFlagIcon, FranceFlagIcon, GermanyFlagIcon, ItalyFlagIcon, JapanFlagIcon } from '../assets/icons';
import { getDeckById } from '../data/decks';

type Props = {
  deckId?: string;
  icon?: 'spain' | 'france' | 'germany' | 'italy' | 'japan';
  size?: number;
};

export default function DeckIcon({ deckId, icon, size = 32 }: Props) {
  const iconType = icon || (deckId ? getDeckById(deckId).icon : 'spain');

  switch (iconType) {
    case 'spain':
      return <SpainFlagIcon size={size} />;
    case 'france':
      return <FranceFlagIcon size={size} />;
    case 'germany':
      return <GermanyFlagIcon size={size} />;
    case 'italy':
      return <ItalyFlagIcon size={size} />;
    case 'japan':
      return <JapanFlagIcon size={size} />;
    default:
      return <SpainFlagIcon size={size} />;
  }
}
