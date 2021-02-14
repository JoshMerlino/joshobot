module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"warn",
			"w"
		], ...arguments);
		this.register(
			"Warns a user about an action they may have done. ⚠",
			HelpSection.MODERATION,
			[{
				argument: "@User",
				required: true,
			}, {
				argument: "Reason",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Ensure sender has permission
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get arguments
		const [ user, ...reason ] = args;

		// Get member
		const member = await util.user(user, guild);

		// Get persistance and add new entry
		const persistance = guildConfig.commands.warn.persistance;
		persistance.push({ specimen: member.id, moderator: sender.id, expires: Date.now() + 8.64e7 });

		// Get how many warns in time frame
		const nth = ordinalize(persistance.filter(p => p.specimen === member.id).length);

		// Set up embed
		const embed = new MessageEmbed();
		embed.setColor(Color.severe);
		embed.setTitle("Warn");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setDescription(`Warned ${member}${reason.length === 0 ? ".":` for **${reason.join(" ")}**.`}\nThis is their **${nth}** warning in the last 24 hours!`)

		// Write persistance to file
		config[guild.id].commands.warn.persistance = persistance;
		await util.writeConfig(guild.id);

		// Send embed
		return await channel.send(embed);


	}

}
