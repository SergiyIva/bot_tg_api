import { dataMsgs } from "../bot/index.js";
const query = {
    getMessage: (parent, args, {}) => {
        return dataMsgs
            .filter(({ userId }) => userId === args.userId)
            .map(({ content }) => ({ content }));
    }
};
export default query;
