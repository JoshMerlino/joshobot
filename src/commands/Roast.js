module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"roast"
		], ...arguments);
		this.register(
			"Sends a random insult. 😡",
			HelpSection.FUN
		);
	}

	async onCommand({ sender, channel }) {

		// Start typing
		channel.startTyping();

		// Get roast
		const { roast } = await fetch("https://joshm.us.to/api/v1/roast")
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping());

		// Send embed
		const embed = new MessageEmbed();
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setColor(Color.info);
		embed.setTitle("Roast");
		embed.setDescription(roast);
		return await channel.send(embed);

	}

}
