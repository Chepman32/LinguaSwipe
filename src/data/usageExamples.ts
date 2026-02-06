export type UsageExample = {
  text: string;
  translation: string;
};

export const usageExamplesByCardId: Record<string, UsageExample[]> = {
  'es-1': [
    { text: 'Hola, ¿cómo estás?', translation: 'Hi, how are you?' },
    { text: '¡Hola! Mucho gusto.', translation: 'Hello! Nice to meet you.' },
  ],
  'es-2': [
    { text: 'Adiós, nos vemos mañana.', translation: 'Goodbye, see you tomorrow.' },
    { text: 'Adiós y gracias.', translation: 'Goodbye and thank you.' },
  ],
  'es-3': [
    { text: 'Gracias por tu ayuda.', translation: 'Thank you for your help.' },
    { text: 'Muchas gracias.', translation: 'Thank you very much.' },
  ],
  'es-4': [
    { text: 'Una mesa para dos, por favor.', translation: 'A table for two, please.' },
    { text: 'Por favor, repite.', translation: 'Please, repeat.' },
  ],
  'es-5': [
    { text: 'Lo siento, fue mi culpa.', translation: "I'm sorry, it was my fault." },
    { text: 'Lo siento, no entiendo.', translation: "I'm sorry, I don't understand." },
  ],
  'es-6': [
    { text: 'Sí, claro.', translation: 'Yes, of course.' },
    { text: 'Sí, me gusta.', translation: 'Yes, I like it.' },
  ],
  'es-7': [
    { text: 'No, gracias.', translation: 'No, thanks.' },
    { text: 'No puedo ahora.', translation: "I can't right now." },
  ],
  'es-8': [
    { text: 'Buenos días, señor.', translation: 'Good morning, sir.' },
    { text: '¡Buenos días! ¿Todo bien?', translation: 'Good morning! All good?' },
  ],
  'es-9': [
    { text: 'Buenas noches, hasta mañana.', translation: 'Good night, see you tomorrow.' },
    { text: 'Buenas noches y dulces sueños.', translation: 'Good night and sweet dreams.' },
  ],
  'es-10': [
    { text: '¿Cómo estás hoy?', translation: 'How are you today?' },
    { text: 'Hola, ¿cómo estás?', translation: 'Hi, how are you?' },
  ],
  'es-11': [
    { text: 'Estoy bien, gracias.', translation: "I'm well, thanks." },
    { text: 'Todo está bien.', translation: 'Everything is fine.' },
  ],
  'es-12': [
    { text: '¿Qué tal el viaje?', translation: 'How was the trip?' },
    { text: '¿Qué tal tu día?', translation: 'How is your day?' },
  ],
  'es-13': [
    { text: 'Quiero agua, por favor.', translation: "I'd like water, please." },
    { text: '¿Tienes agua?', translation: 'Do you have water?' },
  ],
  'es-14': [
    { text: 'La comida está deliciosa.', translation: 'The food is delicious.' },
    { text: '¿Dónde hay comida?', translation: 'Where is there food?' },
  ],
  'es-15': [
    { text: 'Un café con leche, por favor.', translation: 'A coffee with milk, please.' },
    { text: 'Necesito café.', translation: 'I need coffee.' },
  ],
  'es-16': [
    { text: 'Prefiero té.', translation: 'I prefer tea.' },
    { text: '¿Quieres té o café?', translation: 'Do you want tea or coffee?' },
  ],
  'es-17': [
    { text: 'Él es mi amigo.', translation: 'He is my friend.' },
    { text: 'Mi amiga vive aquí.', translation: 'My friend lives here.' },
  ],
  'es-18': [
    { text: 'Mi familia vive aquí.', translation: 'My family lives here.' },
    { text: 'Estoy con mi familia.', translation: 'I am with my family.' },
  ],
  'es-19': [
    { text: 'Tengo mucho trabajo hoy.', translation: 'I have a lot of work today.' },
    { text: 'Voy al trabajo.', translation: 'I am going to work.' },
  ],
  'es-20': [
    { text: 'Voy a la escuela.', translation: 'I go to school.' },
    { text: 'La escuela está cerca.', translation: 'The school is nearby.' },
  ],
  'es-21': [
    { text: 'Hablas muy rápido.', translation: 'You speak very fast.' },
    { text: 'El coche es rápido.', translation: 'The car is fast.' },
  ],
  'es-22': [
    { text: 'Por favor, más lento.', translation: 'Please, slower.' },
    { text: 'Camina lento.', translation: 'Walk slowly.' },
  ],
  'es-23': [
    { text: 'Este teléfono es nuevo.', translation: 'This phone is new.' },
    { text: 'Es un lugar nuevo para mí.', translation: "It's a new place for me." },
  ],
  'es-24': [
    { text: 'Ese edificio es viejo.', translation: 'That building is old.' },
    { text: 'Mi coche es viejo.', translation: 'My car is old.' },
  ],
  'es-25': [
    { text: 'Qué bonito.', translation: 'How beautiful.' },
    { text: 'Tu casa es bonita.', translation: 'Your house is pretty.' },
  ],
  'es-26': [
    { text: 'Es demasiado caro.', translation: "It's too expensive." },
    { text: 'Ese restaurante es caro.', translation: 'That restaurant is expensive.' },
  ],
  'es-27': [
    { text: 'Es barato y bueno.', translation: "It's cheap and good." },
    { text: 'Busco algo barato.', translation: "I'm looking for something cheap." },
  ],
  'es-28': [
    { text: '¿Dónde está el baño?', translation: 'Where is the bathroom?' },
    { text: '¿Dónde está la estación?', translation: 'Where is the station?' },
  ],
  'es-29': [
    { text: '¿Cuánto cuesta?', translation: 'How much does it cost?' },
    { text: '¿Cuánto es en total?', translation: 'How much is it in total?' },
  ],
  'es-30': [
    { text: '¡Salud!', translation: 'Cheers!' },
    { text: 'Salud y felicidad.', translation: 'Health and happiness.' },
  ],

  'fr-1': [
    { text: 'Bonjour, comment ça va ?', translation: 'Hello, how are you?' },
    { text: 'Bonjour ! Enchanté.', translation: 'Hello! Nice to meet you.' },
  ],
  'fr-2': [
    { text: 'Au revoir, à bientôt.', translation: 'Goodbye, see you soon.' },
    { text: 'Au revoir, bonne journée !', translation: 'Goodbye, have a nice day!' },
  ],
  'fr-3': [
    { text: 'Merci beaucoup.', translation: 'Thank you very much.' },
    { text: 'Merci pour votre aide.', translation: 'Thank you for your help.' },
  ],
  'fr-4': [
    { text: "Un café, s'il vous plaît.", translation: 'A coffee, please.' },
    { text: "Pouvez-vous répéter, s'il vous plaît ?", translation: 'Can you repeat, please?' },
  ],
  'fr-5': [
    { text: 'Désolé, je suis en retard.', translation: "Sorry, I'm late." },
    { text: "Je suis désolé, je ne comprends pas.", translation: "I'm sorry, I don't understand." },
  ],
  'fr-6': [
    { text: 'Oui, bien sûr.', translation: 'Yes, of course.' },
    { text: 'Oui, avec plaisir.', translation: 'Yes, with pleasure.' },
  ],
  'fr-7': [
    { text: 'Non, merci.', translation: 'No, thanks.' },
    { text: "Non, pas aujourd'hui.", translation: 'No, not today.' },
  ],
  'fr-8': [
    { text: 'Bon matin !', translation: 'Good morning!' },
    { text: 'Bon matin, comment ça va ?', translation: 'Good morning, how are you?' },
  ],
  'fr-9': [
    { text: 'Bonne nuit, dors bien.', translation: 'Good night, sleep well.' },
    { text: 'Bonne nuit et à demain.', translation: 'Good night and see you tomorrow.' },
  ],
  'fr-10': [
    { text: "Comment ça va aujourd'hui ?", translation: 'How are you today?' },
    { text: 'Salut, comment ça va ?', translation: 'Hi, how are you?' },
  ],
  'fr-11': [
    { text: 'Je vais bien, merci.', translation: "I'm well, thanks." },
    { text: 'Tout va bien.', translation: 'Everything is fine.' },
  ],
  'fr-12': [
    { text: 'Quoi de neuf ?', translation: "What's new?" },
    { text: 'Alors, quoi de neuf ?', translation: "So, what's new?" },
  ],
  'fr-13': [
    { text: "Je voudrais de l'eau.", translation: "I'd like some water." },
    { text: "Tu as de l'eau ?", translation: 'Do you have water?' },
  ],
  'fr-14': [
    { text: 'La nourriture est excellente.', translation: 'The food is excellent.' },
    { text: "J'aime la nourriture française.", translation: 'I like French food.' },
  ],
  'fr-15': [
    { text: 'Je prends un café.', translation: "I'll have a coffee." },
    { text: 'Un café, s’il vous plaît.', translation: 'A coffee, please.' },
  ],
  'fr-16': [
    { text: 'Je préfère le thé.', translation: 'I prefer tea.' },
    { text: 'Tu veux du thé ?', translation: 'Do you want tea?' },
  ],
  'fr-17': [
    { text: "C'est mon ami.", translation: "He's my friend." },
    { text: 'Mon ami habite ici.', translation: 'My friend lives here.' },
  ],
  'fr-18': [
    { text: 'Ma famille est ici.', translation: 'My family is here.' },
    { text: "Je suis avec ma famille.", translation: 'I am with my family.' },
  ],
  'fr-19': [
    { text: "J'ai beaucoup de travail aujourd'hui.", translation: 'I have a lot of work today.' },
    { text: 'Je vais au travail.', translation: 'I am going to work.' },
  ],
  'fr-20': [
    { text: "Je vais à l'école.", translation: 'I go to school.' },
    { text: "L'école est près d'ici.", translation: 'The school is near here.' },
  ],
  'fr-21': [
    { text: 'Parle plus vite.', translation: 'Speak faster.' },
    { text: 'Le train est vite là.', translation: 'The train gets here fast.' },
  ],
  'fr-22': [
    { text: "Plus lentement, s'il vous plaît.", translation: 'Slower, please.' },
    { text: 'Il marche lentement.', translation: 'He walks slowly.' },
  ],
  'fr-23': [
    { text: "C'est nouveau.", translation: "It's new." },
    { text: "J'ai une nouvelle idée.", translation: 'I have a new idea.' },
  ],
  'fr-24': [
    { text: 'Ce bâtiment est vieux.', translation: 'This building is old.' },
    { text: 'Mon téléphone est vieux.', translation: 'My phone is old.' },
  ],
  'fr-25': [
    { text: "C'est très beau.", translation: "It's very beautiful." },
    { text: 'Quel beau paysage !', translation: 'What a beautiful landscape!' },
  ],
  'fr-26': [
    { text: "C'est trop cher.", translation: "It's too expensive." },
    { text: 'Ce restaurant est cher.', translation: 'That restaurant is expensive.' },
  ],
  'fr-27': [
    { text: "C'est bon marché.", translation: "It's cheap." },
    { text: "Je cherche quelque chose de bon marché.", translation: "I'm looking for something cheap." },
  ],
  'fr-28': [
    { text: 'Où est la gare ?', translation: 'Where is the station?' },
    { text: 'Où est la salle de bain ?', translation: 'Where is the bathroom?' },
  ],
  'fr-29': [
    { text: 'Combien ça coûte ?', translation: 'How much does it cost?' },
    { text: 'Combien est-ce en total ?', translation: 'How much is it in total?' },
  ],
  'fr-30': [
    { text: 'Santé !', translation: 'Cheers!' },
    { text: 'À votre santé !', translation: 'To your health!' },
  ],
};

