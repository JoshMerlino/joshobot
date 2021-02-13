module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"unmute",
			"umute",
			"unm",
			"um"
		], ...arguments);
		this.register(
			"Unmute a member in this server. 🔊",
			HelpSection.MODERATION,
			[{
				argument: "@User",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get arguments
		const [ user ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Unmute")
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// get guild member
		const member = util.user(user, guild);

		// Get mute role
		const muterole = (await util.getMuteRole(guild)).id;

		// If member is muted
		if(Object.keys(util.parseCollection(member.roles.cache)).includes(muterole)) {

			// Remove muterole
			await member.roles.remove(muterole);

			// Configure embed
			embed.setColor(Color.success);
			embed.setDescription(`${member.toString()} is no longer muted.`);

		} else {

			// Configure embed
			embed.setColor(Color.error);
			embed.setDescription(`${member.toString()} is not muted.`);

		}

		// Send embed
		return await channel.send(embed);

	}

}
