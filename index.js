"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./console");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server"));
server_1.default(express_1.default());
const bot_1 = __importDefault(require("./bot"));
const discord_js_1 = require("discord.js");
bot_1.default(new discord_js_1.Client);
//# sourceMappingURL=index.js.map