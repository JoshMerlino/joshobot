module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"8ball"
		], ...arguments);
		this.register(
			"Predicts the future. 🎱",
			HelpSection.FUN,
			[{
				argument: "Question",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// If no args, send usage
		if(args.length === 0) return await this.sendUsage(channel);

		// Get Q&A
		const question = args.join(" ");

		// Get answer
		const { fortune: answer } = await fetch("https://joshm.us.to/api/v1/fortune")
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping());

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle("8 Ball");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setColor(Color.info);
		embed.setDescription(`${sender.displayName} asks "**${question}?**" • 8 Ball says "||*${answer}*||"`, true);

		// Send embed
		await channel.send(embed);

	}

}
