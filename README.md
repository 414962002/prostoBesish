```json
package.json  
{
  "type": "module",
  "name": "botfolder",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "node-telegram-bot-api": "^0.61.0",
    "nodemon": "^2.0.22"
  }
}
```  
  

```javascript
// Import the TelegramBot package
import TelegramBot from 'node-telegram-bot-api';

// Import the TELEGRAM_BOT_TOKEN from token.js file
import {TELEGRAM_BOT_TOKEN} from './token.js';

// Create a new TelegramBot instance with polling enabled
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Create an empty object to store chat IDs and random numbers
const chats = {}

// Create game options as an object in reply_markup
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
            [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
            [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
            [{ text: '0', callback_data: '0' }]
        ]
    })
}

// Create again game options as an object in reply_markup
const againGameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Once again, dude!', callback_data: '/again' }]
        ]
    })
}

// Define asynchronous function to start the game when /game command received
const startGame = async (chatId) => {
    // Send a message to start the game
    await bot.sendMessage(chatId, 'I make a number...');
    // Generate a random number between 0-9 and store it in chat object
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    // Send a message to start the game and pass game options
    bot.sendMessage(chatId, 'Let\'s go!', gameOptions)
}

// Define asynchronous function to initialize commands
const start = async () => {

    // Set the commands for the bot
    bot.setMyCommands([
        { command: '/start', description: 'sss' },
        { command: '/info', description: 'iii' },
        { command: '/game', description: 'ggg' },
        { command: '/help', description: 'hhh' },
        { command: '/again', description: 'aaa' },
    ])

    // Handle incoming messages
    bot.on('message', async msg => {
        // Get the text and chat ID from the message
        const text = msg.text;
        const chatId = msg.chat.id

        try {
            // If /start command is received, reply with a greeting message
            if (text === '/start') {
                return bot.sendMessage(chatId, `Hello! ${msg.from.first_name} ${msg.from.last_name}`)
            }
            // If /info command is received, reply with the chat ID and user's name
            if (text === '/info') {
                return bot.sendMessage(chatId, `You are ID: :`, JSON.stringify (chatId), `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
            }
            // If /game command is received, start the game
            if (text === '/game') {
                return startGame(chatId);
            }
            // If any other text is received, reply with a message to guess again
            return bot.sendMessage(chatId, 'Fuck, Guess once again!', gameOptions)
        } catch (err) {
            // If there is an error, reply with an error message
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!');
        }
    })

    // Handle callback queries
    bot.on('callback_query', async msg => {
        // Get the data and chat ID from the callback query
        const data = msg.data;
        const chatId = msg.message.chat.id;

        // If /again command is received, start the game
        if (data === '/again') {
            return startGame(chatId)
        }

        // If the guessed number matches the generated random number, reply with a message and pass game options
        if (data == chats[chatId]) {
            await bot.sendMessage(chatId,`🏌🏻‍♂️ Right! - there is your lucky digit - ${chats[chatId]}`, gameOptions)
        } else {
            // If the guessed number does not match the generated random number, reply with a message and pass again game options
            await bot.sendMessage(chatId, `💢 Wrong! - there was: ${chats[chatId]}`, againGameOptions)
        }
    })
}

// Call start function to initialize bot
start()

```
