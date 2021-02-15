module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"avatar",
			"av"
		], ...arguments);
		this.register(
			"Displays the profile picture of a user. 🖼",
			HelpSection.MISCELLANEOUS, [{
				argument: "@User",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel, guild }) {

		// Get user
		const user = util.user(args[0] || sender, guild);

		// Send embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setTitle(`${user.displayName}'s avatar`);
		embed.setImage(user.user.displayAvatarURL({ size: 2048 }))
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		return await channel.send(embed);

	}

}
