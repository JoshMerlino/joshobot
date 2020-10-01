module.exports = async function() {

	require("./UptimeManager.js")(async function(guild) {

		// #################
		// # Configuration #
		// #################

		// Get configuration for this specific guild and load it into memory
		const config = await (require("./ConfigurationAPI.js")(guild.id));
		global.config[guild.id] = config;

		// Refresh configuration for this specific guild every second
		client.setInterval(async function() {
			global.config[guild.id] = YAML.parse(await fs.readFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), "utf8"));
		}, 1000);

		// ############
		// # Auditing #
		// ############

		// If the guild has autiting enabled, call all audit hooks
		if(config.audit.enabled) require("./Auditing.js")(client, guild);
		const audit = global.config[guild.id].audit.enabled ? guild.channels.cache.get(global.config[guild.id].audit.channel) : false

		// ###################
		// # Repeating Tasks #
		// ###################

		// Schedule async tasks
		require("./AsyncActions.js")(guild, audit);

		// ############
		// # Commands #
		// ############

		// Register all commands
		const commands = await fs.readdir(path.join(APP_ROOT, "src", "commands"));
		commands.map(command => {
			const Command = require(path.join(APP_ROOT, "src", "commands", command));
			new Command(guild.id);
		});

	});

	// ############
	// # Presence #
	// ############

	// Display presence
	let presenceCount = 0;
	const presence = () => [ "?help", "josho.bot.nu", `${client.guilds.cache.size} Servers` ];
	client.setInterval(async function() {
		client.user.setPresence({
		    activity: {
		        name: presence()[presenceCount],
				type: "PLAYING",
		    },
		    status: "online"
		});
		presenceCount = presenceCount === presence().length - 1 ? 0 : presenceCount + 1;
	}, 5000);

};
