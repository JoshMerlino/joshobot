module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("purge", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel }) {

		let [ messages ] = args;

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_MESSAGES")) {
			if (messages || parseInt(messages) <= 0) {
				if(messages > 99) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Amount of messages to clear can be at most __100__, clearing the 100 most recient messages`));
					messages = 99;
				}

				if(audit) {
					const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[userid].user;
					const message = new MessageEmbed()
					.setColor(config[guild.id].theme.severe)
					.setTitle("Messages Purged")
					.setFooter(`ID: ${userid}`)
					.setTimestamp()
					.setThumbnail(User.displayAvatarURL())
					.setDescription(`Moderator: <@!${sender.id}>\nChannel: \`#${channel.name}\` (<#${channel.id}>)\nAmount: \`${messages}\``)
					audit.send(message);
				}

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
