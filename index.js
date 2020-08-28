const Discord = require("discord.js");

// Initialize client instance
const client = new Discord.Client();

// Log in with the token in the enviroment file
client.login(process.env.CLIENT_SECRET);

// When the client logs in, initialize the client runtime.
client.on("ready", () => require("./src/ClientRuntime.js")(client));
