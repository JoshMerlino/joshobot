"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.alias = exports.args = exports.description = exports.permission = exports.category = void 0;
const nested_keys_1 = __importDefault(require("nested-keys"));
const HelpSections_1 = __importDefault(require("../class/HelpSections"));
const embedTemplate_1 = __importDefault(require("../embedTemplate"));
const Diff = __importStar(require("diff"));
exports.category = HelpSections_1.default.MODERATION;
exports.permission = "ADMINISTRATOR";
exports.description = "Reads or updates the guild configuration ⚙.";
exports.args = [{ argument: "Key", required: false }, { argument: "Value", required: false }];
exports.alias = ["config", "cfg", "configuration"];
async function handler(message, command) {
    const { channel } = message;
    const embed = embedTemplate_1.default(message, command);
    embed.setTitle("Configuration");
    const [, key, sourceVal = null, ...rest] = message.content.split(" ");
    if (key === undefined) {
        embed.setDescription(`Showing the full configuration for **${message.guild?.name}**\n\n\`\`\`json\n${JSON.stringify(command.config.value, null, 4)}\n\`\`\``);
        return await channel.send(embed);
    }
    if (sourceVal === null) {
        embed.setDescription(`\`${key}\` = \`${JSON.stringify(command.config.value[key])}\``);
        return await channel.send(embed);
    }
    const type = (v) => JSON.parse(`{ "_": ${v} }`)._;
    let val;
    try {
        val = type([sourceVal, ...rest].join(" "));
    }
    catch (e) {
        val = [sourceVal, ...rest].join(" ");
    }
    const beforeConfig = command.config.value;
    const afterConfig = { ...beforeConfig };
    nested_keys_1.default.set(afterConfig, key.split("."), val);
    const lines = Diff.diffLines(JSON.stringify(beforeConfig, null, 4), JSON.stringify(afterConfig, null, 4));
    const diff = lines
        .map(line => {
        return line;
    })
        .flatMap(part => {
        const color = part.added ? "+" : part.removed ? "-" : " ";
        return (color + part.value.split("\n").join(`\n${color}`)).split("\n");
    })
        .filter(line => !["-", "+", " "].includes(line));
    command.config.value = afterConfig;
    embed.setDescription(`Showing the updated configuration for **${message.guild?.name}**\n\n\`\`\`diff\n${diff.join("\n")}\n\`\`\``);
    return await channel.send(embed);
}
exports.handler = handler;
//# sourceMappingURL=config.js.map