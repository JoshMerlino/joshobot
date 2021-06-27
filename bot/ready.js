"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const guild_1 = __importDefault(require("./guild"));
const presenceManager_1 = __importDefault(require("./presenceManager"));
function ready() {
    if (this === undefined || this === null) {
        return console.error("Error logging into Discord.");
    }
    console.info("Logged into Discord as", chalk_1.default.cyan(this.user?.tag));
    presenceManager_1.default(this);
    this.guilds.cache.array().map(server => guild_1.default(server, this));
    this.on("guildCreate", server => guild_1.default(server, this));
}
exports.default = ready;
//# sourceMappingURL=ready.js.map