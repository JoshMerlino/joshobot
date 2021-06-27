"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("./class/Color"));
const discord_js_1 = require("discord.js");
function embedTemplate(message, { config, alias }) {
    const embed = new discord_js_1.MessageEmbed;
    embed.setColor(Color_1.default.BLURPLE);
    embed.setFooter(`${config.value.prefix}${alias.toLowerCase()} • ${message.author.tag}`, message.author.avatarURL());
    embed.setTimestamp();
    return embed;
}
exports.default = embedTemplate;
//# sourceMappingURL=embedTemplate.js.map