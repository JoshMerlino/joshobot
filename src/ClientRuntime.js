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

		const audit = global.config[guild.id].audit.enabled ? guild.channels.cache.get(global.config[guild.id].audit.channel) : false

		function unmute({ moderator, specimen, channel }) {

			guild.member(specimen).roles.remove(global.config[guild.id].commands["mute"].muterole);
			guild.channels.resolve(channel).send(new MessageEmbed()
			.setColor(global.config[guild.id].theme.success)
			.setDescription(`<@!${specimen}> is no longer muted.`));

			if(audit) {
				const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[specimen].user;
				const message = new MessageEmbed()
				.setColor(global.config[guild.id].theme.severe)
				.setTitle("User Unmuted")
				.setFooter(`ID: ${specimen}`)
				.setTimestamp()
				.setThumbnail(User.displayAvatarURL())
				.setDescription(`Moderator: <@!${moderator}>\nUser: <@!${specimen}>`)
				audit.send(message);
			}

		}

		setInterval(function() {

			global.config[guild.id].commands["mute"].persistance.map(async (entry, key) => {
				const { expires } = entry;
				if(expires < Date.now()) {
					global.config[guild.id].commands["mute"].persistance.splice(key, 1);
					await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(global.config[guild.id]), "utf8");
					unmute(entry)
				}
			})

		}, 1000)

	}

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => await activateGuild(guild));

	// On new guild, activate
	client.on("guildCreate", async guild => await activateGuild(guild));

};
