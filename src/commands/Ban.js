module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("ban", ...arguments);
		this.register("Bans a member from the server. 🔨", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "BAN_MEMBERS")) return await util.noPermissions(channel, sender);

		// Get params
		const [ user = null, ...reason ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Ban")
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

		// If ban target has ban permissions
		if(util.hasPermissions(member, guildConfig, "BAN_MEMBERS")) {
			embed.setColor(guildConfig.theme.server);
			embed.addField("Error", `${member.toString()} is not able to be banned. They most likley have equal or greater permissions than you.`, true)
            return await channel.send(embed);
		}

		member.ban({ days: 7, reason: reason.join(" ") }).then(async function() {

			embed.setColor(guildConfig.theme.succcess);
			embed.addField("User", member.toString(), true);
			reason.length > 0 && embed.addField("Reason", reason.join(" "), true);
			return await channel.send(embed);

		}).catch(async error => {

			embed.setColor(guildConfig.theme.error);
			embed.addField("Error", error.toString().split(":")[2], true)
            return await channel.send(embed);

		})

	}

}
