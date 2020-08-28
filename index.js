const Discord = require("discord.js");

// Initialize client instance
const client = new Discord.Client();

// Define some global variables
global.APP_ROOT = __dirname;

// Log in with the token in the enviroment file
client.login(process.env.CLIENT_SECRET);

// When the client logs in, initialize the client runtime.
client.on("ready", () => require("./src/ClientRuntime.js")(client));
