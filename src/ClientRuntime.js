// Cache guilds for api
const guilds = {};

module.exports = async function() {

	// Get global configuration
	const defaultConfig = YAML.parse(await fs.readFile(path.join(APP_ROOT, "default-config.yml"), "utf8"));

	// Register all enums
	(await fs.readdir(path.join(APP_ROOT, "src", "enum"))).map(e => global[e.split(".js")[0]] = require(path.join(APP_ROOT, "src", "enum", e)));

	// Initialize each guild
	require("./UptimeManager.js")(async function(guild) {

		// Get configuration for this specific guild and load it into memory
		const config = await (require("./ConfigurationAPI.js")(guild.id));
		global.config[guild.id] = config;

		// Refresh configuration for this specific guild every second
		client.setInterval(async function() {
			global.config[guild.id] = YAML.parse(await fs.readFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), "utf8"));
		}, 1000);

		// If the guild has autiting enabled, call all audit hooks
		if(config.audit.enabled) require("./Auditing.js")(client, guild);

		// Schedule async tasks
		require("./AsyncActions.js")(guild);

		// Register all commands
		(await fs.readdir(path.join(APP_ROOT, "src", "commands"))).map(command => {
			const Command = require(path.join(APP_ROOT, "src", "commands", command));
			new Command(guild.id);
		});

		async function saveCache() {

			const { name, ownerID: owner, verified, region, id, memberCount } = guild;

			guilds[guild.id] = {
				name, owner, verified, region, id,
				memberCount,
				memberOnline: guild.members.cache.filter(member => member.presence.status !== "offline").size,
				bannerURL: guild.bannerURL(),
				iconURL: guild.iconURL(),
				inviteCodes: Object.values(util.parseCollection(await guild.fetchInvites())).map(({ code }) => code),
			}
		}

		client.setInterval(saveCache, 1000);
		await saveCache();

	});

	client.setInterval(async function() {
		await fs.writeFile(path.join(APP_ROOT, "api.db"), JSON.stringify(guilds, null, 4), "utf8");
	}, 1000);

	// Display presence
	let presenceCount = 0;
	const presence = () => [ "?help", `${client.guilds.cache.size} Servers` ];
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
