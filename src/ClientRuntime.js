module.exports = async function() {

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => {

		// Get configuration for this specific guild
		const config = await (require("./ConfigurationAPI.js")(guild.id));
		global.config[guild.id] = config;

		const commands = await fs.readdir(path.join(APP_ROOT, "src", "commands"));
		commands.map(command => {
			const Command = require(path.join(APP_ROOT, "src", "commands", command));
			new Command(guild.id);
		});

	})

};
