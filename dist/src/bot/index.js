import { Markup, Telegraf } from "telegraf";
import { commands, info, print } from "../utility/const.js";
import { message } from "telegraf/filters";
export let chats = [
    {
        userId: "0",
        chatId: -892072144,
        lastAction: 1
    },
    {
        userId: "0",
        chatId: -884398668,
        lastAction: 0
    },
    {
        userId: "0",
        chatId: -997579116,
        lastAction: 2
    }
];
export const dataMsgs = [];
export const changeChats = (newChat) => {
    chats = chats.map((chat) => chat.chatId === newChat.chatId ? newChat : chat);
};
export const bot = new Telegraf(process.env.TELEGRAM);
//app.use(await bot.createWebhook({ domain: "webhookDomain" }));
bot.start((ctx) => ctx.reply("Добро пожаловать!"));
bot.help((ctx) => ctx.reply(commands));
bot.command("menu", async (ctx) => {
    try {
        await ctx.replyWithHTML("<b>Выберите действие:</b>", Markup.inlineKeyboard([
            [
                Markup.button.callback("🔍 Поиск", "search"),
                Markup.button.callback("☸ Настройки", "settings")
            ],
            [Markup.button.callback("📞 Информация", "info")] // Row2 with 2 buttons
        ]));
    }
    catch (e) {
        print(e);
    }
});
bot.action("info", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(info);
    }
    catch (e) {
        print(e);
    }
});
bot.action("settings", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        if (ctx.from.username !== process.env.USER_NAME)
            await ctx.replyWithHTML("<b>Доступ запрещен!</b>");
        else if (ctx.chat.id > 0)
            await ctx.replyWithHTML("<b>Изменение настроек доступно только в групповых чатах!</b>");
        else if (chats.map(({ chatId }) => chatId).indexOf(ctx.chat.id) >= 0)
            await ctx.replyWithHTML("<b>Данный чат подключен</b>", Markup.inlineKeyboard([
                [Markup.button.callback("⛔️ Отключить", "stopChat")]
            ]));
        else
            await ctx.replyWithHTML("<b>Данный чат отключен</b>", Markup.inlineKeyboard([
                [Markup.button.callback("🚀 Включить", "startChat")]
                //      [Markup.button.callback("Отмена", "info")]
            ]));
    }
    catch (e) {
        print(e);
    }
});
bot.action("startChat", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        chats = [...chats, { userId: "0", lastAction: 0, chatId: ctx.chat.id }];
        await ctx.replyWithHTML("<b>Успешно!</b>");
    }
    catch (e) {
        print(e);
    }
});
bot.action("stopChat", async (ctx) => {
    try {
        await ctx.answerCbQuery();
        chats = chats.filter(({ chatId }) => chatId !== ctx.chat.id);
        await ctx.replyWithHTML("<b>Успешно!</b>");
    }
    catch (e) {
        print(e);
    }
});
bot.on(message("text"), (ctx) => {
    if (chats.map(({ chatId }) => chatId).indexOf(ctx.chat.id) >= 0) {
        const userId = chats.find(({ chatId }) => chatId === ctx.chat.id).userId;
        dataMsgs.push({
            userId,
            content: ctx.message.text.substring(2),
            chat: ctx.chat.id
        });
    }
    ctx.reply(ctx.message.text);
});
