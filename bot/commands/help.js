"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.alias = exports.args = exports.description = exports.category = void 0;
const async_require_context_1 = __importDefault(require("async-require-context"));
const path_1 = require("path");
const HelpSections_1 = __importDefault(require("../class/HelpSections"));
const embedTemplate_1 = __importDefault(require("../embedTemplate"));
exports.category = HelpSections_1.default.GENERAL;
exports.description = "Shows this message 😎.";
exports.args = [{ argument: "Help section", required: false }];
exports.alias = ["help", "h"];
async function handler(message, command) {
    const { channel } = message;
    const embed = embedTemplate_1.default(message, command);
    embed.setTitle("Help • Josh O' Bot");
    const [root, ...args] = message.content.split(" ");
    const list = [];
    const prefix = command.config.value.prefix;
    if (args.length === 1) {
        const commands = await async_require_context_1.default(path_1.resolve("./lib/bot/commands"));
        const section = Object.keys(HelpSections_1.default).filter(key => key.toLowerCase().includes(args[0].toLowerCase()))[0];
        if (section !== undefined) {
            commands.map(context => {
                const { description = "", alias, category = "MISCELLANEOUS", args = [] } = context.module;
                const aliases = typeof alias === "object" ? alias : [alias];
                if (category.toString().toUpperCase() !== section)
                    return;
                list.push(`\`${prefix}${aliases[0]}\` • **${description}**`);
                list.push(`**Usage**: \`${prefix}${aliases[0]}${args.map(({ required, argument }) => ` ${required ? "<" : "("}${argument}${required ? ">" : ")"}`).join("")}\``);
                if (aliases.length > 1)
                    list.push(`**Aliases**: \`${prefix}${aliases.splice(1).join(`\`, \`${prefix}`)}\``);
                list.push("\n");
            });
            embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
            return channel.send(embed);
        }
    }
    list.push(`Heres a list of command sections. For more info, do \`${root} [section]\`\n `);
    Object.keys(HelpSections_1.default).map(category => {
        list.push(`**${HelpSections_1.default[category].toString()} Commands**`);
        list.push(`\`${root} ${category.toString().toLowerCase()}\``);
        list.push("\n");
    });
    list.push("[Support Server](https://discord.gg/5ha2Zk) • [Get Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot)");
    embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
    return channel.send(embed);
}
exports.handler = handler;
//# sourceMappingURL=help.js.map