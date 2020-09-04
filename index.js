// Import some modules into the global scope
global.Discord = require("discord.js");
global.YAML = require("yaml");
global.path = require("path");
global.dayjs = require("dayjs");
global.ms = require("ms");
global.cms = require("pretty-ms");
global.fs = require("fs").promises;

// Load dayjs plugins
dayjs.extend(require("dayjs/plugin/relativeTime"));

// Initialize client instance
const client = new Discord.Client();

// Define some global variables
global.APP_ROOT = __dirname;
global.client = client;
global.config = {};
global.MessageEmbed = Discord.MessageEmbed;

// Log in with the token in the enviroment file
client.login(process.env.CLIENT_SECRET);

// When the client logs in, initialize the client runtime.
client.on("ready", require("./src/ClientRuntime.js"));
