const mineflayer = require('mineflayer');
const http = require('http');

// Keep-Alive Web Server
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(8080);

// Bot Configuration
const botArgs = {
  host: '91.98.147.128', 
  port: 25567, // Άλλαξέ το αν ο server σου έχει άλλη θύρα
  username: 'IdleBot',         
  version: false               
};

function initBot() {
  const bot = mineflayer.createBot(botArgs);

  bot.on('login', () => {
    console.log(`[LOG] ${bot.username} logged in.`);
  });

  bot.on('disconnect', (reason) => {
    console.log(`[DISCONNECT] Reconnecting in 10s...`);
    setTimeout(initBot, 10000);
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });
}

initBot();
