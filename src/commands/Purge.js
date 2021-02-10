module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"purge",
			"bulkdelete"
		], ...arguments);
		this.register(
			"Bulk delete messages in a channel. ❌",
			HelpSection.MODERATION,
			[{
				argument: "Amount",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_MESSAGES")) return await util.noPermissions(channel, sender);

		// Get amount of messages
		let [ messages ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Purge Messages")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// if number is not a number
		if (isNaN(parseInt(messages))) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
			return await channel.send(embed);
		}

		messages++;

		embed.setColor(Color.success);
		embed.addField("Amount", `${messages-1} Total Messages`, true)

		let numleft = messages;
		while(numleft > 100) {
			await channel.bulkDelete(100);
			numleft -= 100;
		}

		await channel.bulkDelete(numleft % 100);

		return await channel.send(embed);

	}

}
