const mineflayer = require('mineflayer');
const http = require('http');

// Keep-Alive Web Server για το Render
http.createServer((req, res) => {
  res.write("Bot is running!");
  res.end();
}).listen(8080);

// Ρυθμίσεις του Bot
const botArgs = {
  host: '91.98.147.128', 
  port: 25567, 
  username: 'ServerBot', // Το όνομα που βάλατε στη whitelist         
  version: "1.21.11"               
};

let bot;
let isConnecting = false; // Εμποδίζει τις διπλές συνδέσεις από το Render

function initBot() {
  if (isConnecting) return; // Αν προσπαθεί ήδη να συνδεθεί, σταμάτα
  isConnecting = true;

  console.log("[LOG] Attempting to connect to Minecraft server...");
  bot = mineflayer.createBot(botArgs);

  bot.on('login', () => {
    console.log(`[LOG] ${bot.username} logged in successfully.`);
    isConnecting = false;
  });

  bot.on('disconnect', (reason) => {
    console.log(`[DISCONNECT] Lost connection: ${reason}. Reconnecting in 15s...`);
    isConnecting = false;
    setTimeout(initBot, 15000); // Μεγαλύτερη αναμονή για να προλάβει να καθαρίσει ο server
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
    isConnecting = false;
  });
}

initBot();
