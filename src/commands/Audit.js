module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"audit",
			"au"
		], ...arguments);
		this.register(
			"Manage server audit logging. ℹ",
			HelpSection.MODERATION,
			[{
				argument: "enable | disable",
				required: true,
			}, {
				argument: "#Channel",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "VIEW_AUDIT_LOG")) return;

		// If no args, send usage
		if(args.length === 0) return this.sendUsage(channel);

		// Get params
		const [ subcommand, target = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Audit Logging");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());

		// Switch subcommand
		switch(subcommand.toLowerCase()) {

			// Enable
			case "enable":
			case "en":
			case "e":

				// If no channel
				if(target === null) return this.sendUsage(channel);

				// Get channel
				const targetChannel = util.channel(target, guild);

				// Add audit to config
				config[guild.id].audit.enabled = true;
				config[guild.id].audit.channel = targetChannel.id;

				// Write config to disk
				await util.writeConfig(guild.id);

				// Enable auditing
				require("../Auditing.js")(client, guild);

				// Send audit
				await sendAudit(guild, {
					sender,
					color: "success",
					title: "Enabled Audit Logging",
					desc: "Audit logging has been enabled in this channel. You will now receive messages about actions made to the server.",
				});

				// Send embed
				embed.setColor(Color.success);
				embed.setDescription(`Audit logging enabled in the ${targetChannel.toString()} channel!`);
				return await channel.send(embed);

			// Disable
			case "disable":
			case "dis":
			case "d":

				// Disable auditing
				config[guild.id].audit.enabled = false;
				await util.writeConfig(guild.id);

				// Send audit
				await sendAudit(guild, {
					sender,
					color: "error",
					title: "Disabled Audit Logging",
					desc: "This channel will no longer receive messages about actions made to the server.",
				});

				// Send embed
				embed.setColor(Color.severe);
				embed.setDescription(`Audit logging disabled!`);
				return await channel.send(embed);

		}

		// If unknown sub-arg
		return this.sendUsage(channel);

	}

}
