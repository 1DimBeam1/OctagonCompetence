const express = require("express");
const app = express();
const TelegramBot = require('node-telegram-bot-api');

const token = '7498108843:AAH-GEkKdWy9ss0mp8vIogGifB97TAD3VjQ';

const bot = new TelegramBot(token, {polling: true});

const greetMessageUser = {};


bot.onText(/\/start/, (msg) => 
{
    const chatId = msg.chat.id;
    if (!greetMessageUser[chatId])
    {
        const message = "Привет, октагон!";
        bot.sendMessage(chatId, message);
        greetMessageUser[chatId] = true;
    }
    else
    {
        const message = "Введите команду /help";
        bot.sendMessage(chatId, message);
    }
});

bot.onText(/\/help/, (msg) => 
{
	let helpText = "Список команд:\n/site - отправляет в чат ссылку на сайт октагона\n/creator - отправляет в чат ФИО разработчика";
    bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/site/, (msg) => {
	bot.sendMessage(msg.chat.id, "https://forus.ru/");
});

bot.onText(/\/creator/, (msg) => {
	bot.sendMessage(msg.chat.id, "Мачкасов Дмитрий Анатольевич");
});



bot.on('polling_error', (error) => 
{
    console.error('polling_error', error);
});

app.listen(3000);