module.exports = async function() {

	// Get global configuration
	const defaultConfig = YAML.parse(await fs.readFile(path.join(APP_ROOT, "default-config.yml"), "utf8"));

	// Register all enums
	(await fs.readdir(path.join(APP_ROOT, "src", "enum"))).map(e => global[e.split(".js")[0]] = require(path.join(APP_ROOT, "src", "enum", e)));

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

		// ###################
		// # Repeating Tasks #
		// ###################

		// Schedule async tasks
		require("./AsyncActions.js")(guild);

		// ############
		// # Commands #
		// ############

		// Register all commands
		(await fs.readdir(path.join(APP_ROOT, "src", "commands"))).map(command => {
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

	// ########################
	// # Status Change Notice #
	// ########################

	// Ping me when bot restarts
	;(async function() {
		if(process.env.MODE !== "PRODUCTION") return;
		const ping = new Discord.MessageEmbed()
		  .setColor(defaultConfig.theme.warn)
		  .setTitle("Status Change Notice")
		  .setDescription("Josh O' Bot was updated!")
		  .setTimestamp()
		(await client.users.fetch("444651464867184640")).send(ping);
		// client.users.cache.get("466508791312023552").send(ping);
	}())

};
