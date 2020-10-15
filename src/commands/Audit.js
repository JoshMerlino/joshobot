module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("audit", ...arguments);
		this.register("Manage server audit logging. ℹ", HelpSection.MODERATION, [{
			argument: "setup | disable",
			required: true,
		}, {
			argument: "#Channel",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "VIEW_AUDIT_LOG")) return await util.noPermissions(channel, sender);

		// Get params
		const [ subcommand = null, target = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Auditing")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If not enough arguments, send default message
		if (subcommand === null) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		if (subcommand.toLowerCase() === "setup") {

			config[guild.id].audit.enabled = true;
			config[guild.id].audit.channel = util.channel(target, guild);
			await util.writeConfig(guild.id);

			embed.setColor(guildConfig.theme.success)
			embed.addField("Status", "Audit logging enabled", true)
			embed.addField("Channel", util.channel(target, guild).toString(), true);

			await sendAudit(guild, {
				sender,
				color: "success",
				title: "Enabled Audit Logging",
				desc: "Audit logging has been enabled in this channel. You will now receive a message about actions made to the server.",
			})

			require("../Auditing.js")(client, guild);
			return await channel.send(embed);

		}

		if (subcommand.toLowerCase() === "disable") {

			config[guild.id].audit.enabled = false;
			await util.writeConfig(guild.id);

			embed.setColor(guildConfig.theme.success)
			embed.addField("Status", "Audit logging disabled", true)

			await sendAudit(guild, {
				sender,
				color: "error",
				title: "Disabled Audit Logging",
				desc: "This channel will no longer receive messages about actions made to the server.",
			});

			return await channel.send(embed);

		}

	}

}
