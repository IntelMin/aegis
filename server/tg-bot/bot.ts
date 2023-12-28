const TelegramBot = require('node-telegram-bot-api');
const supabase = require('../supabase');
require('dotenv').config({ path: '../../.env.local' });
// Replace 'YOUR_BOT_TOKEN' with your actual bot token
console.log(process.env.TG_BOT_TOKEN)
const bot = new TelegramBot(String(process.env.TG_BOT_TOKEN), { polling: true });
bot.onText(/\/start/, async (msg:any) => {
    const chatId = msg.chat.id;
    const userid = msg.from.id;
    console.log(msg)
    const {data: user, error} = await supabase.from("tg-users").select("*").eq("userid", userid).single()
    if (!user) {
        const { data, error: error2 } = await supabase.from("tg-users").insert([{ userid:userid, chatid:chatId }]);
        if (error2) {
            console.log(error2, "error")
            return bot.sendMessage(chatId, 'Error creating user.');
        }
    }

    bot.sendMessage(chatId, 'Welcome aegis bug bounty bot.\n\nUse /subscribe to subscribe to the bug bounty program.\nUse /unsubscribe to unsubscribe from the bug bounty program.\nUse /help to get help.');

});

bot.onText(/\/subscribe/, async (msg:any) => {
    const chatId = msg.chat.id;
    const userid = msg.from.id;
    const {data: user, error} = await supabase.from("tg-users").select("*").eq("userid", userid).single()
    if (!user) {
        const { data, error: error2 } = await supabase.from("tg-users").insert([{ userid:userid, chatid:chatId }]);
        if (error2) {
            console.log(error2, "error")
            return bot.sendMessage(chatId, 'Error creating user.');
        }
    }
    const { data, error: error2 } = await supabase.from("tg-users").update({subscribed:true}).eq("userid", userid);
    if (error2) {
        console.log(error2, "error")
        return bot.sendMessage(chatId, 'Error subscribing user.');
    }
    bot.sendMessage(chatId, 'You have been subscribed to the bug bounty program.');
});

bot.onText(/\/unsubscribe/, async (msg:any) => {
    const chatId = msg.chat.id;
    const userid = msg.from.id;
    const {data: user, error} = await supabase.from("tg-users").select("*").eq("userid", userid).single()
    if (!user) {
        const { data, error: error2 } = await supabase.from("tg-users").insert([{ userid:userid, chatid:chatId }]);
        if (error2) {
            console.log(error2, "error")
            return bot.sendMessage(chatId, 'Error creating user.');
        }
    }
    const { data, error: error2 } = await supabase.from("tg-users").update({subscribed:false}).eq("userid", userid);
    if (error2) {
        console.log(error2, "error")
        return bot.sendMessage(chatId, 'Error unsubscribing user.');
    }
    bot.sendMessage(chatId, 'You have been unsubscribed from the bug bounty program.');
});

// Add more bot commands and event listeners here

// console.log('Bot is running...');
