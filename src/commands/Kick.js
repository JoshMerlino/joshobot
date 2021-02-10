module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"kick",
			"k"
		], ...arguments);
		this.register(
			"Kick a member from the server. 🥾",
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

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "KICK_MEMBERS")) return await util.noPermissions(channel, sender);

		// Get arguments
		const [ user = null, ...reason ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Kick")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If not enough params
		if(user === null) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		// get guild member
		const member = util.user(user, guild);

		// If ban target has ban permissions
		if(util.hasPermissions(member, guildConfig, "KICK_MEMBERS")) {
			embed.setColor(Color.server);
			embed.addField("Error", `${member.toString()} is not able to be kicked. They most likley have equal or greater permissions than you.`, true)
            return await channel.send(embed);
		}

		member.kick(reason.join(" ")).then(async function() {
			embed.setColor(Color.success);
			embed.addField("User", member.toString(), true);
			reason.length > 0 && embed.addField("Reason", reason.join(" "), true);
			return await channel.send(embed);
		}).catch(async error => {
			embed.setColor(Color.error);
			embed.addField("Error", error.toString().split(":")[2], true)
            return await channel.send(embed);
		})

	}

}
