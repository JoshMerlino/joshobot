const path = require("path");
const { promises: fs } = require("fs");

module.exports = async function(client) {

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => {

		// Get configuration for this specific guild
		const config = await (require("./ConfigurationAPI.js")(guild.id));

		const commands = await fs.readdir(path.join(APP_ROOT, "src", "commands"));
		commands.map(command => {
			require(path.join(APP_ROOT, "src", "commands", command))(client, config)
		});

	})


};
