const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    downloadMediaMessage,
  } = require('@whiskeysockets/baileys');

  const P      = require('pino');
  const chalk  = require('chalk');
  const moment = require('moment');
  const axios  = require('axios');
  const fs     = require('fs-extra');

  const cfg          = require('./config');
  const store        = require('./database/store');
  const menu         = require('./lib/menu');
  const handleDl     = require('./lib/download');
  const handleFun    = require('./lib/fun');
  const gamesHandler = require('./lib/games');
  const groupHandler = require('./lib/group');
  const ownerHandler = require('./lib/owner');
  const toolsHandler = require('./lib/tools');

  const msgCache = new Map();

  function showBanner() {
    console.clear();
    console.log(chalk.cyan('╔════════════════════════════╗'));
    console.log(chalk.cyan('║      LESTA BOT v2  🇰🇪      ║'));
    console.log(chalk.cyan('║   WhatsApp Automation      ║'));
    console.log(chalk.cyan('╚════════════════════════════╝\n'));
  }

  function isOwner(sender) {
    const owners = store.getSetting('owners', [cfg.ownerNumber]);
    return owners.includes(sender.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, ''));
  }

  async function handleAI(sock, msg, body, from) {
    if (!store.getSetting('aimode', false)) return false;
    if (body.startsWith(cfg.prefix)) return false;
    if (msg.key.fromMe) return false;
    try {
      const res = await axios.get(
        `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(body)}&owner=LestaBot`,
        { timeout: 8000 }
      );
      if (res.data?.response) {
        await sock.sendMessage(from, { text: `🤖 ${res.data.response}` }, { quoted: msg });
        return true;
      }
    } catch {}
    return false;
  }

  async function handleViewOnce(sock, msg) {
    if (!store.getSetting('antiviewonce', false)) return;
    const vo = msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message;
    if (!vo) return;
    const from   = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const imgMsg = vo.imageMessage;
    const vidMsg = vo.videoMessage;
    if (!imgMsg && !vidMsg) return;
    try {
      const fakeMsg = { message: vo, key: msg.key };
      const buffer  = await downloadMediaMessage(fakeMsg, 'buffer', {});
      const caption = `👁️ *Anti-ViewOnce* — Sent by @${sender.split('@')[0]}`;
      if (imgMsg) {
        await sock.sendMessage(from, { image: buffer, caption }, { mentions: [sender] });
      } else {
        await sock.sendMessage(from, { video: buffer, caption }, { mentions: [sender] });
      }
    } catch {}
  }

  async function handleAutoSeeStatus(sock, msg) {
    if (!store.getSetting('autosee', false)) return;
    if (msg.key.remoteJid !== 'status@broadcast') return;
    try {
      await sock.readMessages([msg.key]);
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❤️', key: msg.key } });
    } catch {}
  }

  async function handleAutoStatus(sock) {
    if (!store.getSetting('autostatus', false)) return;
    const now = moment();
    try {
      await sock.sendMessage('status@broadcast', {
        text: `${cfg.autobioText}\n🕐 ${now.format('HH:mm')} | ${now.format('ddd, D MMM')}`
      });
    } catch {}
  }

  async function startBot() {
    showBanner();

    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version }          = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger: P({ level: 'silent' }),
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      shouldIgnoreJid: jid => jid.endsWith('@broadcast'),
    });

    if (!state.creds.registered) {
      console.log(chalk.yellow(`⏳ Requesting pairing code for ${cfg.ownerNumber}...`));
      await new Promise(r => setTimeout(r, 3000));
      let retries = 5;
      while (retries-- > 0) {
        try {
          console.log(chalk.yellow(`\n🔄 Attempting to get pairing code (Attempt ${6 - retries}/5)...`));
          const code = await sock.requestPairingCode(cfg.ownerNumber);
          
          if (!code) {
            throw new Error('No pairing code returned from WhatsApp');
          }
          
          console.log(chalk.green('\n╔══════════════════════════════╗'));
          console.log(chalk.green(`║  PAIRING CODE: ${code}  ║`));
          console.log(chalk.green('╚══════════════════════════════╝\n'));
          console.log(chalk.cyan('📱 WhatsApp → Linked Devices → Link with phone number\n'));
          console.log(chalk.yellow('⏳ Waiting for WhatsApp to confirm pairing...\n'));
          break;
        } catch (err) {
          console.log(chalk.red(`❌ Error: ${err.message}`));
          console.log(chalk.yellow(`Stack: ${err.stack}`));
          if (retries > 0) {
            console.log(chalk.yellow(`🔄 Retrying in 5s... (${retries} retries left)\n`));
            await new Promise(r => setTimeout(r, 5000));
          } else {
            console.log(chalk.red('❌ FAILED: Could not get pairing code after 5 attempts.'));
            console.log(chalk.red('📝 Solutions:'));
            console.log(chalk.red('   1. Delete the "session" folder and restart'));
            console.log(chalk.red('   2. Check your phone number format (should be: country code + number)'));
            console.log(chalk.red('   3. Make sure your WhatsApp account is not logged in on another device'));
            console.log(chalk.red('   4. Wait a few minutes and try again\n'));
            process.exit(1);
          }
        }
      }
    }

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log(chalk.yellow('\n🔗 QR Code generated. Scan with WhatsApp:\n'));
      }
      
      if (connection === 'open') {
        console.log(chalk.green('✅ Connected to WhatsApp!'));
        console.log(chalk.cyan('🤖 Lesta Bot v2 — 70+ commands active! 🇰🇪\n'));
        await ownerHandler.startAutobio(sock, cfg);
        setInterval(() => handleAutoStatus(sock), 2 * 60 * 60 * 1000);
      }
      if (connection === 'close') {
        const statusCode      = lastDisconnect?.error?.output?.statusCode;
        const loggedOut       = statusCode === DisconnectReason.loggedOut;
        const sessionConflict = statusCode === DisconnectReason.connectionReplaced;
        console.log(chalk.red(`⚠️  Connection closed (code: ${statusCode})`));
        if (loggedOut || sessionConflict) {
          console.log(chalk.red('🗑️  Session invalid — clearing and restarting...'));
          try { await fs.remove('./session'); } catch {}
          setTimeout(() => startBot(), 2000);
        } else {
          console.log(chalk.yellow('🔄 Reconnecting in 3s...'));
          setTimeout(() => startBot(), 3000);
        }
      }
    });

    sock.ev.on('creds.update', async () => {
      console.log(chalk.green('✅ Credentials saved successfully!'));
      await saveCreds();
    });

    sock.ev.on('group-participants.update', async (update) => {
      try { await groupHandler.handleParticipants(sock, update); } catch {}
    });

    sock.ev.on('messages.delete', async (item) => {
      if (!store.getSetting('antidelete', false)) return;
      for (const key of (item.keys || [])) {
        const cached = msgCache.get(key.id);
        if (!cached) continue;
        const { msg: oldMsg, from: oldFrom, sender } = cached;
        try {
          const body = oldMsg.message?.conversation || oldMsg.message?.extendedTextMessage?.text || '';
          if (body) {
            await sock.sendMessage(oldFrom, {
              text: `🗑️ *Deleted Message by @${sender.split('@')[0]}:*\n\n${body}`,
              mentions: [sender]
            });
          }
        } catch {}
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;
      for (const msg of messages) {
        if (!msg.message) continue;
        if (msg.key.fromMe && !msg.key.remoteJid?.endsWith('@s.whatsapp.net')) continue;
        const from    = msg.key.remoteJid;
        const sender  = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const body    = msg.message?.conversation
                     || msg.message?.extendedTextMessage?.text
                     || msg.message?.imageMessage?.caption
                     || msg.message?.videoMessage?.caption
                     || '';
        if (msg.key.id) {
          msgCache.set(msg.key.id, { msg, from, sender });
          if (msgCache.size > 500) msgCache.delete(msgCache.keys().next().value);
        }
        try { await handleAutoSeeStatus(sock, msg); } catch {}
        try { await handleViewOnce(sock, msg); } catch {}
        if (!msg.key.fromMe && body && store.getSetting('autotyping', false)) {
          try { await sock.sendPresenceUpdate('composing', from); } catch {}
          setTimeout(async () => { try { await sock.sendPresenceUpdate('paused', from); } catch {} }, 2000);
        }
        if (!msg.key.fromMe && body && store.getSetting('autorecording', false)) {
          try { await sock.sendPresenceUpdate('recording', from); } catch {}
          setTimeout(async () => { try { await sock.sendPresenceUpdate('paused', from); } catch {} }, 2000);
        }
        if (isGroup && !msg.key.fromMe) {
          try { await groupHandler.handleGroupEvents(sock, msg, isGroup); } catch {}
        }
        if (!isGroup && !msg.key.fromMe && body) {
          const senderNum  = sender.replace('@s.whatsapp.net', '');
          const hasGreeted = store.getUser(senderNum, 'greeted', false);
          if (!hasGreeted) {
            store.setUser(senderNum, 'greeted', true);
            try { await sock.sendMessage(from, { text: cfg.followUpMsg }); } catch {}
          }
        }
        const botMode = store.getSetting('botmode', 'public');
        if (botMode === 'private' && isGroup) continue;
        if (botMode === 'group'   && !isGroup) continue;
        if (!msg.key.fromMe && body && !body.startsWith(cfg.prefix)) {
          try {
            const answered = await gamesHandler.checkGameAnswer(sock, msg, body);
            if (answered) continue;
          } catch {}
          try { await handleAI(sock, msg, body, from); } catch {}
          continue;
        }
        if (!body.startsWith(cfg.prefix)) continue;
        const command = body.slice(cfg.prefix.length).trim().split(' ')[0].toLowerCase();
        const args    = body.slice(cfg.prefix.length).trim().split(' ').slice(1);
        console.log(chalk.cyan(`[CMD] ${command} | ${sender.split('@')[0]} | ${isGroup ? 'Group' : 'DM'}`));
        const ownerCheck = isOwner(sender);
        let isAdmin = false, isBotAdmin = false;
        if (isGroup) {
          try {
            const meta   = await sock.groupMetadata(from);
            const admins = meta.participants.filter(p => p.admin).map(p => p.id);
            isAdmin    = admins.includes(sender);
            isBotAdmin = admins.some(id => id.includes(sock.user?.id?.split(':')[0]));
          } catch {}
        }
        try {
          if (command === 'menu') { await menu(sock, from, cfg.prefix); continue; }
          if (await ownerHandler(sock, msg, command, args, ownerCheck))                       continue;
          if (await groupHandler(sock, msg, command, args, isGroup, isAdmin, isBotAdmin))     continue;
          if (await handleDl(sock, msg, command, args))                                       continue;
          if (await toolsHandler(sock, msg, command, args))                                   continue;
          if (await gamesHandler(sock, msg, command, args))                                   continue;
          if (await handleFun(sock, msg, command, args))                                      continue;
          await sock.sendMessage(from, {
            text: `❓ Unknown command: *${cfg.prefix}${command}*\nSend *${cfg.prefix}menu* to see all commands.`
          }, { quoted: msg });
        } catch (err) {
          console.error(chalk.red(`[ERR] ${command}: ${err.message}`));
          try { await sock.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: msg }); } catch {}
        }
      }
    });
  }

  startBot();
