module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("audit", ...arguments);
		this.register("Manage server audit logging. ℹ", HelpSection.MODERATION, [{
			argument: "enable | disable | channel",
			required: true,
		}, {
			argument: "#Channel",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ subcommand = null, target = null ] = args;

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "VIEW_AUDIT_LOG")) {

			if (subcommand === null) {
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <channel|enable|disable> [#channel (channel)]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			} else if (subcommand.toLowerCase() === "enable") {

				config[guild.id].audit.enabled = true;
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");

				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.success)
				.setDescription(`Audit logging enabled.\nSet the audit channel with \`${root} channel <#channel>\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				require("../Auditing.js")(client, guild);

			} else if (subcommand.toLowerCase() === "disable") {

				config[guild.id].audit.enabled = false;
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");

				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.success)
				.setDescription(`Disabled auditing.`)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));

			} else if (subcommand.toLowerCase() === "channel") {

				if(target === null) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Usage:\n\`${root} channel <#channel>\``)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				} else {

					config[guild.id].audit.enabled = true;
					config[guild.id].audit.channel = target.split("<#")[1].split(">")[0];
					await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");

					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Audit logging enabled in the ${target} channel.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				}

			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
