module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"advice",
			"adv"
		], ...arguments);
		this.register(
			"Gives random life advice. 👨‍🦳",
			HelpSection.MISCELLANEOUS
		);
	}

	async onCommand({ sender, channel }) {

		// Get advice from advice API
		const { advice } = (await fetch(`https://api.adviceslip.com/advice`).then(resp => resp.json())).slip;

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle("Advice");
		embed.setColor(Color.info);
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());
		embed.setDescription(`**A word from the wise** • "||${advice}||"`);

		// Send embed
		await channel.send(embed);

	}

}
