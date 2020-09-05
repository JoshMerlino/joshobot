module.exports = async function() {

	async function activateGuild(guild) {

		// Get configuration for this specific guild
		const config = await (require("./ConfigurationAPI.js")(guild.id));
		global.config[guild.id] = config;

		if(config.audit.enabled) require("./Auditing.js")(client, guild);

		const commands = await fs.readdir(path.join(APP_ROOT, "src", "commands"));
		commands.map(command => {
			const Command = require(path.join(APP_ROOT, "src", "commands", command));
			new Command(guild.id);
		});

	}

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => await activateGuild(guild));

	// On new guild, activate
	client.on("guildCreate", async guild => await activateGuild(guild));

};
