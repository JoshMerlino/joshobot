"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
const filestore_json_1 = __importDefault(require("filestore-json"));
const async_require_context_1 = __importDefault(require("async-require-context"));
const hasPermission_1 = __importDefault(require("./hasPermission"));
const embedTemplate_1 = __importDefault(require("./embedTemplate"));
const Color_1 = __importDefault(require("./class/Color"));
async function guild(guild, client) {
    const defaultConfig = JSON.parse(await promises_1.readFile(path_1.resolve("./defaultConfig.json"), "utf8"));
    const config = filestore_json_1.default.from(path_1.resolve(`./guilds/${guild.id}/config.json`), defaultConfig);
    console.info("Initialized guild", chalk_1.default.cyan(guild.name), chalk_1.default.magenta(guild.id));
    const commands = await async_require_context_1.default(path_1.resolve("./lib/bot/commands"));
    commands.map(context => {
        const aliases = typeof context.module.alias === "object" ? context.module.alias : [context.module.alias];
        client.on("message", (message) => {
            aliases.map(alias => {
                if (message.content.split(" ")[0].toLowerCase() === config.value.prefix + alias.toLowerCase()) {
                    const runnable = { ...context.module, alias, config };
                    if (hasPermission_1.default(guild.member(message.author), context.module.permission || "NONE")) {
                        context.module.handler(message, runnable);
                    }
                    else {
                        const embed = embedTemplate_1.default(message, runnable);
                        embed.setColor(Color_1.default.RED);
                        embed.setTitle("No permission!");
                        embed.setDescription(`You are lacking the permission \`${context.module.permission}\`. Ask an administrator if you have the right roles.`);
                        message.channel.send(embed);
                    }
                }
            });
        });
    });
}
exports.default = guild;
//# sourceMappingURL=guild.js.map