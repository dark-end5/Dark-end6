const { getUser, setUser } = require('../database/store');

const wordList = [
  { word: 'elephant', hint: 'A large grey animal with a trunk' },
  { word: 'beautiful', hint: 'Very attractive or pleasing' },
  { word: 'knowledge', hint: 'Information and skills acquired through experience' },
  { word: 'technology', hint: 'Scientific knowledge used practically' },
  { word: 'adventure', hint: 'An exciting or unusual experience' },
  { word: 'friendship', hint: 'A close bond between people' },
  { word: 'imagination', hint: 'The ability to form mental images' },
  { word: 'mysterious', hint: 'Difficult to understand or explain' },
  { word: 'restaurant', hint: 'A place where meals are served' },
  { word: 'umbrella', hint: 'Used to protect from rain' },
  { word: 'chocolate', hint: 'A sweet brown food made from cacao' },
  { word: 'butterfly', hint: 'A colourful winged insect' },
  { word: 'architect', hint: 'A person who designs buildings' },
  { word: 'library', hint: 'A place to borrow and read books' },
  { word: 'keyboard', hint: 'Used to type on a computer' },
];

const abcdData = {
  A: { animals: ['Ant', 'Alligator', 'Armadillo', 'Antelope', 'Ape'], names: ['Alice', 'Alex', 'Amanda', 'Aaron', 'Angela'], countries: ['Argentina', 'Australia', 'Angola', 'Austria', 'Albania'] },
  B: { animals: ['Bear', 'Buffalo', 'Baboon', 'Bat', 'Bee'], names: ['Brian', 'Bella', 'Ben', 'Beth', 'Bruno'], countries: ['Brazil', 'Belgium', 'Bolivia', 'Bangladesh', 'Botswana'] },
  C: { animals: ['Cat', 'Cobra', 'Cheetah', 'Crane', 'Camel'], names: ['Chris', 'Clara', 'Carlos', 'Cindy', 'Cole'], countries: ['Canada', 'China', 'Colombia', 'Chile', 'Croatia'] },
  D: { animals: ['Dog', 'Dolphin', 'Deer', 'Duck', 'Donkey'], names: ['David', 'Diana', 'Dylan', 'Dana', 'Derek'], countries: ['Denmark', 'Dominican Republic', 'Djibouti', 'DR Congo'] },
  E: { animals: ['Eagle', 'Elephant', 'Eel', 'Elk', 'Echidna'], names: ['Emma', 'Ethan', 'Eliza', 'Eric', 'Eva'], countries: ['Ethiopia', 'Egypt', 'Ecuador', 'Estonia', 'Eritrea'] },
  F: { animals: ['Fox', 'Falcon', 'Flamingo', 'Frog', 'Ferret'], names: ['Frank', 'Faith', 'Felix', 'Fiona', 'Fred'], countries: ['France', 'Finland', 'Fiji', 'Gabon'] },
  G: { animals: ['Giraffe', 'Gorilla', 'Gazelle', 'Gecko', 'Goat'], names: ['Grace', 'George', 'Gloria', 'Gary', 'Gina'], countries: ['Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea'] },
  H: { animals: ['Horse', 'Hippo', 'Hawk', 'Hamster', 'Hyena'], names: ['Harry', 'Hannah', 'Henry', 'Holly', 'Hugo'], countries: ['Hungary', 'Honduras', 'Haiti'] },
  I: { animals: ['Iguana', 'Impala', 'Ibis', 'Insects'], names: ['Ivan', 'Iris', 'Isaac', 'Isla', 'Ian'], countries: ['India', 'Indonesia', 'Ireland', 'Italy', 'Iran'] },
  J: { animals: ['Jaguar', 'Jellyfish', 'Jay', 'Jackal'], names: ['James', 'Julia', 'Jack', 'Jessica', 'Joel'], countries: ['Japan', 'Jordan', 'Jamaica', 'Kenya'] },
  K: { animals: ['Kangaroo', 'Koala', 'Kite', 'Kiwi', 'Kudu'], names: ['Kevin', 'Karen', 'Kyle', 'Katie', 'Kent'], countries: ['Kenya', 'Kuwait', 'Kazakhstan', 'Kyrgyzstan'] },
  L: { animals: ['Lion', 'Leopard', 'Lizard', 'Llama', 'Lynx'], names: ['Liam', 'Lucy', 'Leo', 'Laura', 'Luke'], countries: ['Liberia', 'Libya', 'Lebanon', 'Latvia', 'Laos'] },
  M: { animals: ['Monkey', 'Moose', 'Mole', 'Mongoose', 'Manta Ray'], names: ['Michael', 'Mia', 'Mark', 'Maya', 'Max'], countries: ['Mexico', 'Morocco', 'Madagascar', 'Malaysia', 'Mali'] },
  N: { animals: ['Narwhal', 'Newt', 'Nightingale', 'Numbat'], names: ['Noah', 'Nadia', 'Nathan', 'Nina', 'Neil'], countries: ['Nigeria', 'Niger', 'Nepal', 'Norway', 'Netherlands'] },
  O: { animals: ['Owl', 'Ostrich', 'Otter', 'Orangutan', 'Ox'], names: ['Oliver', 'Olivia', 'Oscar', 'Ophelia', 'Owen'], countries: ['Oman', 'Pakistan'] },
  P: { animals: ['Parrot', 'Penguin', 'Panda', 'Panther', 'Peacock'], names: ['Paul', 'Patricia', 'Peter', 'Priya', 'Patrick'], countries: ['Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal'] },
  Q: { animals: ['Quail', 'Quokka'], names: ['Quinn', 'Quincy'], countries: ['Qatar'] },
  R: { animals: ['Rabbit', 'Rhino', 'Raven', 'Raccoon', 'Rat'], names: ['Ryan', 'Rachel', 'Robert', 'Ruby', 'Rick'], countries: ['Russia', 'Romania', 'Rwanda', 'Saudi Arabia'] },
  S: { animals: ['Snake', 'Shark', 'Sparrow', 'Sloth', 'Scorpion'], names: ['Sam', 'Sophia', 'Steve', 'Sara', 'Simon'], countries: ['South Africa', 'Spain', 'Sweden', 'Switzerland', 'Somalia'] },
  T: { animals: ['Tiger', 'Turtle', 'Toucan', 'Toad', 'Tapir'], names: ['Tom', 'Tina', 'Tyler', 'Teresa', 'Todd'], countries: ['Tanzania', 'Thailand', 'Turkey', 'Tunisia', 'Togo'] },
  U: { animals: ['Urial', 'Umbrellabird'], names: ['Uma', 'Uriah', 'Ulrich'], countries: ['Uganda', 'Ukraine', 'Uruguay', 'USA'] },
  V: { animals: ['Vulture', 'Viper', 'Vole', 'Vicuña'], names: ['Victor', 'Vera', 'Vincent', 'Vanessa'], countries: ['Venezuela', 'Vietnam', 'Vanuatu'] },
  W: { animals: ['Wolf', 'Whale', 'Warthog', 'Walrus', 'Wren'], names: ['William', 'Wendy', 'Walter', 'Whitney', 'Wayne'], countries: ['Zambia', 'Zimbabwe'] },
  X: { animals: ['X-ray Tetra'], names: ['Xavier', 'Xena'], countries: [] },
  Y: { animals: ['Yak', 'Yellow Jacket'], names: ['Yara', 'Yusuf', 'Yvonne'], countries: ['Yemen'] },
  Z: { animals: ['Zebra', 'Zorilla', 'Zonkey'], names: ['Zara', 'Zoe', 'Zachary', 'Zion'], countries: ['Zambia', 'Zimbabwe'] },
};

const quizBank = [
  { q: 'What is the capital of Kenya?', a: 'nairobi' },
  { q: 'How many days are in a leap year?', a: '366' },
  { q: 'What planet is closest to the Sun?', a: 'mercury' },
  { q: 'What is 12 × 12?', a: '144' },
  { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare' },
  { q: 'What is the largest ocean?', a: 'pacific' },
  { q: 'How many sides does a hexagon have?', a: '6' },
  { q: 'What gas do plants absorb?', a: 'carbon dioxide' },
  { q: 'What is the fastest land animal?', a: 'cheetah' },
  { q: 'How many continents are there?', a: '7' },
  { q: 'What is the chemical symbol for water?', a: 'h2o' },
  { q: 'Who invented the telephone?', a: 'bell' },
];

const riddles = [
  { q: "I have hands but can't clap. What am I?", a: 'clock' },
  { q: "The more you take, the more you leave behind. What am I?", a: 'footsteps' },
  { q: "I speak without a mouth and hear without ears. What am I?", a: 'echo' },
  { q: "I have cities but no houses live there. What am I?", a: 'map' },
  { q: "What has keys but no locks, space but no room?", a: 'keyboard' },
  { q: "I fly without wings and cry without eyes. What am I?", a: 'cloud' },
  { q: "The more you share me, the more I grow. What am I?", a: 'knowledge' },
];

const gameState = new Map();

module.exports = async (sock, msg, command, args) => {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const text = args.join(' ').trim().toLowerCase();
  const stateKey = `${from}_${sender}`;

  if (command === 'spell') {
    const item = wordList[Math.floor(Math.random() * wordList.length)];
    const scrambled = item.word.split('').sort(() => Math.random() - 0.5).join('');
    gameState.set(stateKey, { type: 'spell', answer: item.word });
    await sock.sendMessage(from, {
      text: `🔤 *SPELLING GAME*\n\nHint: _${item.hint}_\nScrambled: *${scrambled.toUpperCase()}*\n\nType the correct spelling! (Reply within 60s)`
    }, { quoted: msg });
    setTimeout(() => {
      if (gameState.get(stateKey)?.type === 'spell') {
        gameState.delete(stateKey);
        sock.sendMessage(from, { text: `⏰ Time's up! The answer was: *${item.word}*` });
      }
    }, 60000);
    return true;
  }

  if (command === 'quiz') {
    const item = quizBank[Math.floor(Math.random() * quizBank.length)];
    gameState.set(stateKey, { type: 'quiz', answer: item.a });
    await sock.sendMessage(from, {
      text: `🧠 *QUIZ TIME!*\n\n${item.q}\n\nType your answer!`
    }, { quoted: msg });
    setTimeout(() => {
      if (gameState.get(stateKey)?.type === 'quiz') {
        gameState.delete(stateKey);
        sock.sendMessage(from, { text: `⏰ Time's up! The answer was: *${item.a}*` });
      }
    }, 60000);
    return true;
  }

  if (command === 'riddle') {
    const item = riddles[Math.floor(Math.random() * riddles.length)];
    gameState.set(stateKey, { type: 'riddle', answer: item.a });
    await sock.sendMessage(from, {
      text: `🤔 *RIDDLE ME THIS!*\n\n${item.q}\n\nType your answer!`
    }, { quoted: msg });
    setTimeout(() => {
      if (gameState.get(stateKey)?.type === 'riddle') {
        gameState.delete(stateKey);
        sock.sendMessage(from, { text: `⏰ Time's up! The answer was: *${item.a}*` });
      }
    }, 60000);
    return true;
  }

  if (command === 'abcd') {
    const letter = text.charAt(0).toUpperCase();
    const data = abcdData[letter];
    if (!data) {
      await sock.sendMessage(from, { text: '❌ Usage: .abcd A (use a letter A-Z)' }, { quoted: msg });
      return true;
    }
    await sock.sendMessage(from, {
      text: `🔤 *ABCD — Letter ${letter}*\n\n🐾 Animals: ${data.animals.join(', ')}\n👤 Names: ${data.names.join(', ')}\n🌍 Countries: ${data.countries.join(', ') || 'None'}`
    }, { quoted: msg });
    return true;
  }

  if (command === 'trivia') {
    const item = quizBank[Math.floor(Math.random() * quizBank.length)];
    gameState.set(stateKey, { type: 'trivia', answer: item.a });
    await sock.sendMessage(from, {
      text: `🎯 *TRIVIA*\n\n${item.q}\n\nAnswer within 30 seconds!`
    }, { quoted: msg });
    setTimeout(() => {
      if (gameState.get(stateKey)?.type === 'trivia') {
        gameState.delete(stateKey);
        sock.sendMessage(from, { text: `⏰ Time's up! Correct answer: *${item.a}*` });
      }
    }, 30000);
    return true;
  }

  return false;
};

module.exports.checkGameAnswer = async (sock, msg, body) => {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const stateKey = `${from}_${sender}`;
  const game = gameState.get(stateKey);
  if (!game) return false;
  if (body.toLowerCase().includes(game.answer.toLowerCase())) {
    gameState.delete(stateKey);
    await sock.sendMessage(from, { text: `✅ *Correct!* The answer was *${game.answer}*! 🎉 Well done!` }, { quoted: msg });
    return true;
  }
  return false;
};
