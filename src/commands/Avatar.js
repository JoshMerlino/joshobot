module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("avatar", ...arguments);
		this.register("Displays the profile picture of a user.", HelpSection.GENERAL, [{
			argument: "@User",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		const user = util.user(args[0] || sender, guild);

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setTitle(`${user.displayName}'s avatar`);
		embed.setImage(user.user.displayAvatarURL())
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		await channel.send(embed);

	}

}
