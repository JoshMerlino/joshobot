module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("avatar", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const user = guild.member(args[0] ? args[0].replace(/[\\<>@#&!]/g, "") : sender.id);

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setTitle(`${user.displayName}'s avatar`);
		embed.setImage(user.user.displayAvatarURL())
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		await channel.send(embed);

	}

}
