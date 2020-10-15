module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("warn", ...arguments);
		this.register("Warns a user about an action they may have done. ⚠", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return await util.noPermissions(channel, sender);

		// Parse args
		const [ user = null, ...reason ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Warn")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If no args
		if(user === null) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
			return await channel.send(embed);
		}

		// Get user
		const member = util.user(user, guild);

		// Get previous warns
		const persistance = guildConfig.commands.warn.persistance;

		// Push to warns list
		persistance.push({ specimen: member.id, moderator: sender.id, expires: Date.now() + 8.64e7 });

		// Write persistance to disk
		config[guild.id].commands.warn.persistance = persistance;
		await util.writeConfig(guild.id);

		embed.setColor(guildConfig.theme.severe);
		embed.addField("User", member.toString(), true);
		reason.length > 0 && embed.addField("Reason", reason.join(" "), true);
		embed.addField("Amount", `${persistance.filter(p => p.specimen === member.id).length} warnings in the last 24 hours.`, true);
		return await channel.send(embed);

	}

}
