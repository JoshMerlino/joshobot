// Log errors to console instead of crashing application
process.on("uncaughtException", err => console.error("[ERROR]", err));

// Set up environment
require("dotenv").config();

// Import some modules into the global scope
global.Discord = require("discord.js");
global.ordinalize = require("ordinalize");
global.YAML = require("yaml");
global.path = require("path");
global.fetch = require("node-fetch");
global.dayjs = require("dayjs");
global.ms = require("ms");
global.cms = require("pretty-ms");
global.mkdirp = require("mkdirp");
global.fs = require("fs").promises;
global.isImageUrl = require("is-image-url");

// Load dayjs plugins
dayjs.extend(require("dayjs/plugin/relativeTime"));

// Initialize client instance
const client = new Discord.Client();

// Define some global variables
global.APP_ROOT = __dirname;
global.client = client;
global.config = {};
global.streams = {};
global.help = [];
global.MessageEmbed = Discord.MessageEmbed;

// Import utilities
global.util = require("./src/Util.js");

// Log in with the token in the enviroment file
client.login(process.env.CLIENT_SECRET);

// Configure client
client.setMaxListeners(0);

// When the client logs in, initialize the client runtime.
client.on("ready", require("./src/ClientRuntime.js"));
