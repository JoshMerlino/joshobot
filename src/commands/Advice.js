module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("advice", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const { slip } = await fetch(`https://api.adviceslip.com/advice`).then(resp => resp.json());

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setTitle(`A word from the wise`);
		embed.setDescription(slip.advice);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		await channel.send(embed);

	}

}
