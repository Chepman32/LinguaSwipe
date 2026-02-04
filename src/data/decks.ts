export type LanguageDeck = {
  id: string;
  name: string;
  from: string;
  to: string;
  emoji: string;
  level: string;
  cards: { id: string; term: string; translation: string }[];
};

export const decks: LanguageDeck[] = [
  {
    id: 'es',
    name: 'Spanish',
    from: 'English',
    to: 'Spanish',
    emoji: '🇪🇸',
    level: 'Starter',
    cards: [
      { id: 'es-1', term: 'hola', translation: 'hello' },
      { id: 'es-2', term: 'adiós', translation: 'goodbye' },
      { id: 'es-3', term: 'gracias', translation: 'thank you' },
      { id: 'es-4', term: 'por favor', translation: 'please' },
      { id: 'es-5', term: 'lo siento', translation: 'sorry' },
      { id: 'es-6', term: 'sí', translation: 'yes' },
      { id: 'es-7', term: 'no', translation: 'no' },
      { id: 'es-8', term: 'buenos días', translation: 'good morning' },
      { id: 'es-9', term: 'buenas noches', translation: 'good night' },
      { id: 'es-10', term: '¿cómo estás?', translation: 'how are you?' },
      { id: 'es-11', term: 'bien', translation: 'well' },
      { id: 'es-12', term: '¿qué tal?', translation: "what's up?" },
      { id: 'es-13', term: 'agua', translation: 'water' },
      { id: 'es-14', term: 'comida', translation: 'food' },
      { id: 'es-15', term: 'café', translation: 'coffee' },
      { id: 'es-16', term: 'té', translation: 'tea' },
      { id: 'es-17', term: 'amigo', translation: 'friend' },
      { id: 'es-18', term: 'familia', translation: 'family' },
      { id: 'es-19', term: 'trabajo', translation: 'work' },
      { id: 'es-20', term: 'escuela', translation: 'school' },
      { id: 'es-21', term: 'rápido', translation: 'fast' },
      { id: 'es-22', term: 'lento', translation: 'slow' },
      { id: 'es-23', term: 'nuevo', translation: 'new' },
      { id: 'es-24', term: 'viejo', translation: 'old' },
      { id: 'es-25', term: 'bonito', translation: 'beautiful' },
      { id: 'es-26', term: 'caro', translation: 'expensive' },
      { id: 'es-27', term: 'barato', translation: 'cheap' },
      { id: 'es-28', term: '¿dónde?', translation: 'where?' },
      { id: 'es-29', term: '¿cuánto?', translation: 'how much?' },
      { id: 'es-30', term: 'salud', translation: 'cheers/health' },
    ],
  },
  {
    id: 'fr',
    name: 'French',
    from: 'English',
    to: 'French',
    emoji: '🇫🇷',
    level: 'Starter',
    cards: [
      { id: 'fr-1', term: 'bonjour', translation: 'hello' },
      { id: 'fr-2', term: 'au revoir', translation: 'goodbye' },
      { id: 'fr-3', term: 'merci', translation: 'thank you' },
      { id: 'fr-4', term: 's’il vous plaît', translation: 'please' },
      { id: 'fr-5', term: 'désolé', translation: 'sorry' },
      { id: 'fr-6', term: 'oui', translation: 'yes' },
      { id: 'fr-7', term: 'non', translation: 'no' },
      { id: 'fr-8', term: 'bon matin', translation: 'good morning' },
      { id: 'fr-9', term: 'bonne nuit', translation: 'good night' },
      { id: 'fr-10', term: 'comment ça va ?', translation: 'how are you?' },
      { id: 'fr-11', term: 'bien', translation: 'well' },
      { id: 'fr-12', term: 'quoi de neuf ?', translation: "what's new?" },
      { id: 'fr-13', term: 'eau', translation: 'water' },
      { id: 'fr-14', term: 'nourriture', translation: 'food' },
      { id: 'fr-15', term: 'café', translation: 'coffee' },
      { id: 'fr-16', term: 'thé', translation: 'tea' },
      { id: 'fr-17', term: 'ami', translation: 'friend' },
      { id: 'fr-18', term: 'famille', translation: 'family' },
      { id: 'fr-19', term: 'travail', translation: 'work' },
      { id: 'fr-20', term: 'école', translation: 'school' },
      { id: 'fr-21', term: 'vite', translation: 'fast' },
      { id: 'fr-22', term: 'lent', translation: 'slow' },
      { id: 'fr-23', term: 'nouveau', translation: 'new' },
      { id: 'fr-24', term: 'vieux', translation: 'old' },
      { id: 'fr-25', term: 'beau', translation: 'beautiful' },
      { id: 'fr-26', term: 'cher', translation: 'expensive' },
      { id: 'fr-27', term: 'bon marché', translation: 'cheap' },
      { id: 'fr-28', term: 'où ?', translation: 'where?' },
      { id: 'fr-29', term: 'combien ?', translation: 'how much?' },
      { id: 'fr-30', term: 'santé', translation: 'cheers/health' },
    ],
  },
];

export const defaultDeckId = 'es';

export function getDeckById(id: string) {
  return decks.find((deck) => deck.id === id) ?? decks[0];
}
