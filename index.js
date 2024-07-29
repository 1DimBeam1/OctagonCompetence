const express = require("express");
const app = express();
const TelegramBot = require('node-telegram-bot-api');

const token = '7498108843:AAH-GEkKdWy9ss0mp8vIogGifB97TAD3VjQ';

const bot = new TelegramBot(token, {polling: true});

const greetMessageUser = {};


bot.onText(/\/*/, (msg) => 
{
    const chatId = msg.chat.id;
    if (!greetMessageUser[chatId])
    {
        const message = "Привет, октагон!";
        bot.sendMessage(chatId, message);
        greetMessageUser[chatId] = true;
    }
});


bot.on('polling_error', (error) => 
{
    console.error('polling_error', error);
});

app.listen(3000);