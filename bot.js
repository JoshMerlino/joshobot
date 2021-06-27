"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ready_1 = __importDefault(require("./bot/ready"));
function bot(client) {
    client.on("ready", ready_1.default);
    client.login(process.env.BOT_TOKEN);
}
exports.default = bot;
//# sourceMappingURL=bot.js.map