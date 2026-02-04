export type Card = {
  id: string;
  term: string;
  translation: string;
  imageUrl: string;
};

export type LanguageDeck = {
  id: string;
  name: string;
  from: string;
  to: string;
  icon: 'spain' | 'france' | 'germany' | 'italy' | 'japan';
  level: string;
  cards: Card[];
};

// Helper to generate Unsplash URLs with relevant search terms
const unsplash = (keywords: string, width = 400, height = 300) => {
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keywords)}`;
};

export const decks: LanguageDeck[] = [
  {
    id: 'es',
    name: 'Spanish',
    from: 'English',
    to: 'Spanish',
    icon: 'spain',
    level: 'Starter',
    cards: [
      { id: 'es-1', term: 'hola', translation: 'hello', imageUrl: unsplash('hello greeting wave') },
      { id: 'es-2', term: 'adiós', translation: 'goodbye', imageUrl: unsplash('goodbye wave hand') },
      { id: 'es-3', term: 'gracias', translation: 'thank you', imageUrl: unsplash('thank you gratitude appreciation') },
      { id: 'es-4', term: 'por favor', translation: 'please', imageUrl: unsplash('please polite gesture') },
      { id: 'es-5', term: 'lo siento', translation: 'sorry', imageUrl: unsplash('sorry apology sad') },
      { id: 'es-6', term: 'sí', translation: 'yes', imageUrl: unsplash('yes thumbs up') },
      { id: 'es-7', term: 'no', translation: 'no', imageUrl: unsplash('no stop sign hand') },
      { id: 'es-8', term: 'buenos días', translation: 'good morning', imageUrl: unsplash('morning sunrise coffee') },
      { id: 'es-9', term: 'buenas noches', translation: 'good night', imageUrl: unsplash('night moon stars sleep') },
      { id: 'es-10', term: '¿cómo estás?', translation: 'how are you?', imageUrl: unsplash('conversation talking friends') },
      { id: 'es-11', term: 'bien', translation: 'well', imageUrl: unsplash('happy smile good') },
      { id: 'es-12', term: '¿qué tal?', translation: "what's up?", imageUrl: unsplash('casual friends meeting') },
      { id: 'es-13', term: 'agua', translation: 'water', imageUrl: unsplash('water drop glass') },
      { id: 'es-14', term: 'comida', translation: 'food', imageUrl: unsplash('food meal delicious') },
      { id: 'es-15', term: 'café', translation: 'coffee', imageUrl: unsplash('coffee cup cafe') },
      { id: 'es-16', term: 'té', translation: 'tea', imageUrl: unsplash('tea cup herbal') },
      { id: 'es-17', term: 'amigo', translation: 'friend', imageUrl: unsplash('friends friendship together') },
      { id: 'es-18', term: 'familia', translation: 'family', imageUrl: unsplash('family love parents children') },
      { id: 'es-19', term: 'trabajo', translation: 'work', imageUrl: unsplash('work office business') },
      { id: 'es-20', term: 'escuela', translation: 'school', imageUrl: unsplash('school education classroom') },
      { id: 'es-21', term: 'rápido', translation: 'fast', imageUrl: unsplash('fast speed running') },
      { id: 'es-22', term: 'lento', translation: 'slow', imageUrl: unsplash('slow turtle walking') },
      { id: 'es-23', term: 'nuevo', translation: 'new', imageUrl: unsplash('new fresh modern') },
      { id: 'es-24', term: 'viejo', translation: 'old', imageUrl: unsplash('old vintage antique') },
      { id: 'es-25', term: 'bonito', translation: 'beautiful', imageUrl: unsplash('beautiful flower nature') },
      { id: 'es-26', term: 'caro', translation: 'expensive', imageUrl: unsplash('expensive luxury gold') },
      { id: 'es-27', term: 'barato', translation: 'cheap', imageUrl: unsplash('cheap affordable sale') },
      { id: 'es-28', term: '¿dónde?', translation: 'where?', imageUrl: unsplash('location map direction') },
      { id: 'es-29', term: '¿cuánto?', translation: 'how much?', imageUrl: unsplash('money cash price') },
      { id: 'es-30', term: 'salud', translation: 'cheers/health', imageUrl: unsplash('cheers toast wine glasses') },
    ],
  },
  {
    id: 'fr',
    name: 'French',
    from: 'English',
    to: 'French',
    icon: 'france',
    level: 'Starter',
    cards: [
      { id: 'fr-1', term: 'bonjour', translation: 'hello', imageUrl: unsplash('bonjour hello greeting') },
      { id: 'fr-2', term: 'au revoir', translation: 'goodbye', imageUrl: unsplash('au revoir goodbye') },
      { id: 'fr-3', term: 'merci', translation: 'thank you', imageUrl: unsplash('merci thank you') },
      { id: 'fr-4', term: 's’il vous plaît', translation: 'please', imageUrl: unsplash("s'il vous plait please") },
      { id: 'fr-5', term: 'désolé', translation: 'sorry', imageUrl: unsplash('desole sorry apology') },
      { id: 'fr-6', term: 'oui', translation: 'yes', imageUrl: unsplash('oui yes') },
      { id: 'fr-7', term: 'non', translation: 'no', imageUrl: unsplash('non no') },
      { id: 'fr-8', term: 'bon matin', translation: 'good morning', imageUrl: unsplash('bon matin morning coffee') },
      { id: 'fr-9', term: 'bonne nuit', translation: 'good night', imageUrl: unsplash('bonne nuit night') },
      { id: 'fr-10', term: 'comment ça va ?', translation: 'how are you?', imageUrl: unsplash('comment ca va conversation') },
      { id: 'fr-11', term: 'bien', translation: 'well', imageUrl: unsplash('bien well good') },
      { id: 'fr-12', term: 'quoi de neuf ?', translation: "what's new?", imageUrl: unsplash('quoi de neuf news') },
      { id: 'fr-13', term: 'eau', translation: 'water', imageUrl: unsplash('eau water french') },
      { id: 'fr-14', term: 'nourriture', translation: 'food', imageUrl: unsplash('nourriture food french cuisine') },
      { id: 'fr-15', term: 'café', translation: 'coffee', imageUrl: unsplash('cafe coffee french') },
      { id: 'fr-16', term: 'thé', translation: 'tea', imageUrl: unsplash('the tea') },
      { id: 'fr-17', term: 'ami', translation: 'friend', imageUrl: unsplash('ami friend french') },
      { id: 'fr-18', term: 'famille', translation: 'family', imageUrl: unsplash('famille family french') },
      { id: 'fr-19', term: 'travail', translation: 'work', imageUrl: unsplash('travail work french') },
      { id: 'fr-20', term: 'école', translation: 'school', imageUrl: unsplash('ecole school french') },
      { id: 'fr-21', term: 'vite', translation: 'fast', imageUrl: unsplash('vite fast quick') },
      { id: 'fr-22', term: 'lent', translation: 'slow', imageUrl: unsplash('lent slow') },
      { id: 'fr-23', term: 'nouveau', translation: 'new', imageUrl: unsplash('nouveau new') },
      { id: 'fr-24', term: 'vieux', translation: 'old', imageUrl: unsplash('vieux old') },
      { id: 'fr-25', term: 'beau', translation: 'beautiful', imageUrl: unsplash('beau beautiful') },
      { id: 'fr-26', term: 'cher', translation: 'expensive', imageUrl: unsplash('cher expensive') },
      { id: 'fr-27', term: 'bon marché', translation: 'cheap', imageUrl: unsplash('bon marche cheap') },
      { id: 'fr-28', term: 'où ?', translation: 'where?', imageUrl: unsplash('ou where location') },
      { id: 'fr-29', term: 'combien ?', translation: 'how much?', imageUrl: unsplash('combien how much price') },
      { id: 'fr-30', term: 'santé', translation: 'cheers/health', imageUrl: unsplash('sante cheers health wine') },
    ],
  },
];

export const defaultDeckId = 'es';

export function getDeckById(id: string) {
  return decks.find((deck) => deck.id === id) ?? decks[0];
}

// Helper to get the flag icon component name
export function getDeckIcon(deckId: string) {
  const deck = getDeckById(deckId);
  return deck.icon;
}
