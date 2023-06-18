// npm run dev

const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(token, { polling: true });

const chats = {}

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

const againGameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Once again, dude!', callback_data: '/again' }]
        ]
    })
}
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I make a number...');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    bot.sendMessage(chatId, 'Let\'s go!', gameOptions)
}
const start = async () => {

    bot.setMyCommands([
        { command: '/start', description: 'sss' },
        { command: '/info', description: 'iii' },
        { command: '/game', description: 'ggg' },
        { command: '/help', description: 'hhh' },
        { command: '/again', description: 'aaa' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, `Hello! ${msg.from.first_name} ${msg.from.last_name}`)
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `You are ID: :`, JSON.stringify (chatId), `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Fuck, Guess once again!', gameOptions)
        } catch (err) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId,`🏌🏻‍♂️ Right! - there is your lucky digit - ${chats[chatId]}`, gameOptions)
        } else {
            await bot.sendMessage(chatId, `💢 Wrong! - there was: ${chats[chatId]}`, againGameOptions)
        }
    })
}

start()
