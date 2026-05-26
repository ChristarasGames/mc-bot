const mineflayer = require('mineflayer');
const http = require('http');

// Keep-Alive Web Server για το Render
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(8080);

// Ρυθμίσεις του Bot (Κανονικό όνομα χωρίς σύμβολα)
const botArgs = {
  host: '91.98.147.128', 
  port: 25567, 
  username: 'MC_StayAlive', 
  version: "1.21.11",
  hideErrors: true
};

let bot;
let isConnecting = false;

function initBot() {
  if (isConnecting) return;
  isConnecting = true;

  console.log("[LOG] Attempting to connect to Minecraft server...");
  bot = mineflayer.createBot(botArgs);

  bot.on('login', () => {
    console.log(`[LOG] ${bot.username} connected to network.`);
    isConnecting = false;
  });

  // ΑΥΤΟ ΧΡΕΙΑΖΕΤΑΙ ΓΙΑ ΤΟ TAB ΚΑΙ ΤΟ /LIST
  bot.on('spawn', () => {
    console.log(`[LOG] ${bot.username} has successfully spawned in the world!`);
    
    // Στέλνει ένα μήνυμα στο chat 2 δευτερόλεπτα αφού μπει, για να αναγκάσει το Essentials να τον δείξει
    setTimeout(() => {
      bot.chat("Hello server! Keeping the host alive.");
    }, 2000);
    
    // Ψευδο-κίνηση κάθε 1 δευτερόλεπτο για να μην φάει Kick ως AFK
    if (bot.physics) {
      setInterval(() => {
        bot.look(bot.entity.yaw + 0.1, bot.entity.pitch);
      }, 1000);
    }
  });

  bot.on('disconnect', (reason) => {
    let kickReason = typeof reason === 'object' ? JSON.stringify(reason) : reason;
    console.log(`[DISCONNECT] Lost connection. Reason: ${kickReason}. Reconnecting in 15s...`);
    isConnecting = false;
    setTimeout(initBot, 15000);
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
    isConnecting = false;
  });
}

initBot();
