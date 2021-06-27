"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("./class/Color"));
const discord_js_1 = require("discord.js");
function commandUsage(message, { config, alias, args = [] }) {
    const { prefix } = config.value;
    const embed = new discord_js_1.MessageEmbed;
    embed.setColor(Color_1.default.RED);
    embed.setFooter(`${config.value.prefix}${alias.toLowerCase()} • ${message.author.tag}`, message.author.avatarURL());
    embed.setTitle("Incorrect usage");
    embed.setDescription(`**Usage**: \`${prefix}${alias}${args.map(({ required, argument }) => ` ${required ? "<" : "("}${argument}${required ? ">" : ")"}`).join("")}\``);
    embed.setTimestamp();
    return embed;
}
exports.default = commandUsage;
//# sourceMappingURL=commandUsage.js.map