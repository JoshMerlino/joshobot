module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("advice", ...arguments);
		this.register("Gives random life advice. 👨‍🦳", HelpSection.MISCELLANEOUS);
	}

	async onCommand({ sender, guildConfig, channel }) {

		const { advice } = (await fetch(`https://api.adviceslip.com/advice`).then(resp => resp.json())).slip;

		const embed = new MessageEmbed();
		embed.setTitle("Advice");
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
		embed.addField("A word from the wise", advice);

		await channel.send(embed);

	}

}
