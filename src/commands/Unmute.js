module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("unmute", ...arguments);
		this.register("Unmute a member in this server. 🔊", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return await util.noPermission(channel, sender);

		// Get arguments
		const [ user = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Unmute")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If not enough params
		if(user === null) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		// get guild member
		const member = util.user(user, guild);

		// Get mute role
		const muterole = (await util.getMuteRole(guild)).id;

		// Remove muterole
		member.roles.remove(muterole);

		embed.setColor(guildConfig.theme.success);
		embed.addField("User", member.toString(), true);
		return await channel.send(embed);

	}

}
