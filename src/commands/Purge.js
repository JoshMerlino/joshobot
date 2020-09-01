module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("purge", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel }) {

		const [ messages ] = args;

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_MESSAGES")) {

			if (messages || parseInt(messages) <= 0) {

				await channel.bulkDelete(messages);

			} else {

				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <amount>\``));

			}

		} else {

			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));

		}

	}

}
