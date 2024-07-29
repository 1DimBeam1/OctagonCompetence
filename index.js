const express = require("express");
const app = express();
const mysql = require("mysql2");

const TelegramBot = require('node-telegram-bot-api');

const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        database: "chatbottests",
        password: ""
    });
    
    connection.connect(function(err)
    {
        if (err)
        {
            return console.error("Ошибка: " + err.message)
        }
        else
        {
            console.log("Подключение к серверу MySQL успешно выполнено")
        }
    });

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
	let helpText = "Список команд:\n/site - отправляет в чат ссылку на сайт октагона\n/creator - отправляет в чат ФИО разработчика\n" + 
    "/randomItem - отправляет в чат случайный предмет из БД\n"+
    "/deleteItem - удаляет предмет из БД по id\n"+
    "/getItemByID - отправяте в чат предмет из БД по id\n";
    bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/site/, (msg) => 
{
	bot.sendMessage(msg.chat.id, "https://forus.ru/");
});

bot.onText(/\/creator/, (msg) => 
{
	bot.sendMessage(msg.chat.id, "Мачкасов Дмитрий Анатольевич");
});

bot.onText(/\/randomItem/, (msg) => 
{
	connection.query('SELECT * FROM items', function(err, results, fields) 
    {
		if (err) 
        {
			bot.sendMessage(msg.chat.id, err);
		} 
        else if (results.length === 0) 
        {
			bot.sendMessage(msg.chat.id, "Предметов в БД не найдено");
		} 
        else 
        {
			const randomIndex = Math.floor(Math.random() * results.length);
			const randomItem = results[randomIndex];
			const message = "[" + randomItem.id + "]" + " - " + randomItem.name + ": " + randomItem.descr;
			bot.sendMessage(msg.chat.id, message);
		}
	});
});

bot.onText(/\/deleteItem (.+)/, (msg, match) => 
{
	const args = match[1];
	if (args.indexOf(' ') != -1)
	{
		bot.sendMessage(msg.chat.id, "Введите одно число в поле ID");
		return;
	}
	const id = Number(args);
	if (isNaN(id))
	{
		bot.sendMessage(msg.chat.id, "Введите число в поле ID");
		return;
	}
	connection.query('DELETE FROM items WHERE ID = ?', [args], function(err, results, fields) 
    {
		if (err) 
        {
			bot.sendMessage(msg.chat.id, "Ошибка БД при удалении предмета");
		} 
        else if (results.affectedRows === 0) 
        {
			bot.sendMessage(msg.chat.id, "Ошибка");
		} 
        else 
        {
			bot.sendMessage(msg.chat.id, "Удачно");
		}
	});
});

bot.onText(/\/getItemByID (.+)/, (msg, match) => 
{
	const args = match[1];
	if (args.indexOf(' ') != -1)
	{
		bot.sendMessage(msg.chat.id, "Введите одно число в поле ID");
		return;
	}
	const id = Number(args);
	if (isNaN(id))
	{
		bot.sendMessage(msg.chat.id, "Введите число в поле ID");
		return;
	}
	connection.query('SELECT * FROM items WHERE id = ?', [args], function(err, results, fields) 
    {
		if (err) 
        {
			bot.sendMessage(msg.chat.id, err);
		} 
        else if (results.length === 0) 
        {
			bot.sendMessage(msg.chat.id, "Предметов в БД не найдено");
		} 
        else 
        {
			const message = "[" + results[0].id + "]" + " - " + results[0].name + ": " + results[0].descr;
			bot.sendMessage(msg.chat.id, message);
		}
	});
});


bot.on('polling_error', (error) => 
{
    console.error('polling_error', error);
});

app.listen(3000);