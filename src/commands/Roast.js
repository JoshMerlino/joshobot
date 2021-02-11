module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"roast"
		], ...arguments);
		this.register(
			"Sends a random insult. 😡",
			HelpSection.MISCELLANEOUS
		);
	}

	async onCommand({ sender, channel }) {

		const embed = new MessageEmbed();
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());
		embed.setColor(Color.info);
		embed.setTitle("Roast");
		embed.setDescription(Texts.ROASTS[Math.floor(Math.random() * Texts.ROASTS.length)]);
		return await channel.send(embed);

	}

}
