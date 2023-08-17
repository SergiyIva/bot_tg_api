import _ from "lodash";
import { bot, changeChats, chats } from "../bot/index.js";
const mutation = {
    sendMessage: async (parent, { userId, msg }, {}) => {
        const fields = ["<b>User</b>: " + userId, "<b>Content</b>: " + msg];
        const fullmsg = fields.reduce((str, val) => str + val + "\n", "");
        let chat = chats.find((chat) => chat.userId === userId);
        console.log(chats);
        if (!chat) {
            chat = _.chain(chats).minBy("lastAction").value();
        }
        try {
            changeChats({ ...chat, lastAction: Date.now(), userId });
            await bot.telegram.sendMessage(chat["chatId"], fullmsg, {
                parse_mode: "HTML"
            });
            return true;
        }
        catch (err) {
            return false;
        }
    }
};
export default mutation;
