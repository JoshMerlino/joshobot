module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("purge", ...arguments);
		this.register("Bulk delete messages in a channel. ❌", HelpSection.MODERATION, [{
			argument: "Amount",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, audit, guild }) {

		let [ messages ] = args;

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_MESSAGES")) {
			if (!isNaN(parseInt(messages))) {

				messages++;

				let numleft = messages;
				while(numleft > 100) {
					await channel.bulkDelete(100);
					numleft -= 100;
				}
				await channel.bulkDelete(numleft % 100);

			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <amount>\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
