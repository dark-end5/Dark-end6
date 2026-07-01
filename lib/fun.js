const axios = require('axios');

const jokes = [
  "😂 Why don't scientists trust atoms? Because they make up everything!",
  "😂 Why did the scarecrow win an award? He was outstanding in his field!",
  "😂 I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "😂 Why don't eggs tell jokes? Because they'd crack each other up!",
  "😂 What do you call a fake noodle? An impasta!",
  "😂 Why couldn't the bicycle stand up by itself? It was two-tired!",
  "😂 What do you call cheese that isn't yours? Nacho cheese!",
  "😂 How do you organize a space party? You planet!",
  "😂 Why did the math book look so sad? Because it had too many problems.",
  "😂 What do sprinters eat before a race? Nothing — they fast!",
];
const quotes = [
  "⚡ Stay consistent, not perfect. — Unknown",
  "🌟 The secret of getting ahead is getting started. — Mark Twain",
  "🔥 Believe you can and you're halfway there. — Theodore Roosevelt",
  "💪 Success is not final, failure is not fatal. — Winston Churchill",
  "✨ Your limitation—it's only your imagination.",
  "🚀 Push yourself, because no one else is going to do it for you.",
  "🌈 Great things never come from comfort zones.",
  "💯 Dream it. Wish it. Do it.",
  "🏆 Success doesn't just find you. You have to go out and get it.",
  "🌙 The harder you work for something, the greater you'll feel when you achieve it.",
];
const facts = [
  "🧠 Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs!",
  "🐙 Octopuses have three hearts and blue blood.",
  "🌍 The Earth is not perfectly round — it's slightly flattened at the poles.",
  "⚡ Lightning strikes the Earth about 100 times every second.",
  "🦋 Butterflies taste with their feet.",
  "🐘 Elephants are the only animals that can't jump.",
  "🌙 A day on Venus is longer than a year on Venus.",
  "🍫 Chocolate was once used as currency by the Aztecs.",
  "🧬 Human DNA is 99.9% identical to every other human on Earth.",
  "🐠 Clownfish can change their gender — all are born male.",
];
const eightBall = [
  "🎱 It is certain.", "🎱 Without a doubt.", "🎱 Yes, definitely.",
  "🎱 You may rely on it.", "🎱 As I see it, yes.", "🎱 Most likely.",
  "🎱 Outlook good.", "🎱 Signs point to yes.", "🎱 Reply hazy, try again.",
  "🎱 Ask again later.", "🎱 Better not tell you now.", "🎱 Cannot predict now.",
  "🎱 Don't count on it.", "🎱 My reply is no.", "🎱 My sources say no.",
  "🎱 Outlook not so good.", "🎱 Very doubtful.",
];
const truths = [
  "What is your biggest fear?", "What's the most embarrassing thing you've done?",
  "Have you ever lied to a friend?", "What's your biggest secret?",
  "What's the worst thing you've ever done?", "Who is your crush?",
  "What's the most childish thing you still do?", "Have you ever cheated on a test?",
  "What do you think about most often?", "What is your biggest regret?",
];
const dares = [
  "Sing the chorus of your favourite song!", "Do 20 push-ups right now!",
  "Text your crush 'I love you'!", "Change your profile picture for 1 hour!",
  "Send a voice note saying 'I am a banana'!", "Do a funny dance and record it!",
  "Write a love poem for the person above you!", "Post a throwback photo on your status!",
  "Speak in an accent for the next 5 minutes!", "Call a random contact and say happy birthday!",
];
const roasts = [
  "You're not stupid; you just have bad luck thinking.",
  "I'd agree with you, but then we'd both be wrong.",
  "You have your entire life to be an idiot. Take a day off!",
  "Somewhere out there, someone is thinking of you and smiling — then hits you with their car.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "Keep rolling your eyes. Maybe you'll find a brain back there.",
  "I was going to roast you, but my mom says I'm not allowed to burn trash.",
  "You're proof that even evolution makes mistakes sometimes.",
];
const compliments = [
  "You light up every room you walk into! ☀️",
  "You're more fun than bubble wrap! 🎉",
  "Your kindness is a superpower! 💪",
  "You make the world a better place just by being in it! 🌍",
  "You have the best laugh! 😄",
  "You're genuinely one of the most amazing people I know! ✨",
  "Your smile could cure any bad day! 😊",
  "You're so talented — don't ever stop what you're doing! 🚀",
];
const horoscopes = {
  aries: "♈ Aries: Bold moves bring great rewards today. Trust your instincts!",
  taurus: "♉ Taurus: Focus on comfort and stability — your patience will pay off.",
  gemini: "♊ Gemini: Communication is your superpower today. Share your ideas!",
  cancer: "♋ Cancer: Emotional connections deepen. Nurture your relationships.",
  leo: "♌ Leo: The spotlight is yours! Own it with confidence.",
  virgo: "♍ Virgo: Details matter today. Your careful eye will spot what others miss.",
  libra: "♎ Libra: Balance and harmony guide you. A compromise leads to success.",
  scorpio: "♏ Scorpio: Transformation is near. Embrace the change coming your way.",
  sagittarius: "♐ Sagittarius: Adventure calls! Explore new horizons today.",
  capricorn: "♑ Capricorn: Hard work is paying off — stay the course!",
  aquarius: "♒ Aquarius: Innovation leads the way. Think outside the box.",
  pisces: "♓ Pisces: Dreams and intuition guide you to something magical.",
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMentioned(msg) {
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  return mentioned[0] ? '@' + mentioned[0].split('@')[0] : 'you';
}

module.exports = async (sock, msg, command, args) => {
  const from = msg.key.remoteJid;
  const text = args.join(' ').trim();

  if (command === 'joke') {
    try {
      const r = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single', { timeout: 5000 });
      await sock.sendMessage(from, { text: `😂 ${r.data.joke}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(from, { text: rand(jokes) }, { quoted: msg });
    }
    return true;
  }

  if (command === 'quote') {
    await sock.sendMessage(from, { text: rand(quotes) }, { quoted: msg });
    return true;
  }

  if (command === 'fact') {
    await sock.sendMessage(from, { text: rand(facts) }, { quoted: msg });
    return true;
  }

  if (command === '8ball') {
    if (!text) return sock.sendMessage(from, { text: '❓ Ask a question: .8ball <question>' }, { quoted: msg }), true;
    await sock.sendMessage(from, { text: `🎱 *${text}*\n\n${rand(eightBall)}` }, { quoted: msg });
    return true;
  }

  if (command === 'coinflip') {
    await sock.sendMessage(from, { text: `🪙 Flipping coin... *${Math.random() > 0.5 ? 'HEADS' : 'TAILS'}!*` }, { quoted: msg });
    return true;
  }

  if (command === 'dice') {
    await sock.sendMessage(from, { text: `🎲 You rolled: *${Math.floor(Math.random() * 6) + 1}*` }, { quoted: msg });
    return true;
  }

  if (command === 'love') {
    const target = pickMentioned(msg) || text || 'someone';
    const pct = Math.floor(Math.random() * 101);
    const bar = '❤️'.repeat(Math.floor(pct / 10)) + '🤍'.repeat(10 - Math.floor(pct / 10));
    await sock.sendMessage(from, {
      text: `💕 *Love Calculator*\n\n${bar}\n\nLove for ${target}: *${pct}%*\n\n${pct >= 80 ? '😍 Pure soulmates!' : pct >= 50 ? '💖 Great connection!' : '💙 There\'s potential!'}`
    }, { quoted: msg });
    return true;
  }

  if (command === 'rate') {
    const target = pickMentioned(msg) || text || 'you';
    const rate = Math.floor(Math.random() * 101);
    await sock.sendMessage(from, { text: `⭐ *Rating for ${target}:* ${rate}/100\n${'⭐'.repeat(Math.round(rate / 20))}` }, { quoted: msg });
    return true;
  }

  if (command === 'ship') {
    const parts = text.split(/\s+/);
    if (parts.length < 2) return sock.sendMessage(from, { text: '💞 Usage: .ship <name1> <name2>' }, { quoted: msg }), true;
    const pct = Math.floor(Math.random() * 101);
    const ship = parts[0].slice(0, Math.ceil(parts[0].length / 2)) + parts[1].slice(Math.floor(parts[1].length / 2));
    await sock.sendMessage(from, { text: `💞 *Ship Name:* ${ship}\n⚡ *Compatibility:* ${pct}%\n\n${pct >= 70 ? '❤️ Perfect match!' : pct >= 40 ? '💛 Good potential!' : '💙 Keep trying!'}` }, { quoted: msg });
    return true;
  }

  if (command === 'roast') {
    const target = pickMentioned(msg) || text || 'you';
    await sock.sendMessage(from, { text: `🔥 *Roasting ${target}:*\n\n${rand(roasts)}` }, { quoted: msg });
    return true;
  }

  if (command === 'compliment') {
    const target = pickMentioned(msg) || text || 'you';
    await sock.sendMessage(from, { text: `💐 *To ${target}:*\n\n${rand(compliments)}` }, { quoted: msg });
    return true;
  }

  if (command === 'horoscope') {
    const sign = text.toLowerCase();
    const result = horoscopes[sign];
    if (!result) {
      await sock.sendMessage(from, { text: `🔮 Unknown sign. Options:\n${Object.keys(horoscopes).join(', ')}` }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: result }, { quoted: msg });
    }
    return true;
  }

  if (command === 'truth') {
    await sock.sendMessage(from, { text: `😳 *TRUTH:*\n\n${rand(truths)}` }, { quoted: msg });
    return true;
  }

  if (command === 'dare') {
    await sock.sendMessage(from, { text: `😈 *DARE:*\n\n${rand(dares)}` }, { quoted: msg });
    return true;
  }

  return false;
};
