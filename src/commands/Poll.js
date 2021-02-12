module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"poll",
			"sug",
			"suggest"
		], ...arguments);
		this.register(
			"Creates a poll. ❎",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "Poll",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// If no args
		if(args.length === 0) return await this.sendUsage(channel);

		// Get message
		const msg = args.join(" ");

		// Set up embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setTitle(`${sender.displayName} Created a Poll`);
		embed.setDescription(msg);

		// Add reactions
		const poll = await channel.send(embed)
        await poll.react("👍");
        await poll.react("👎");

	}

}
