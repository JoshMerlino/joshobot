module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("addemoji", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ name = null, link = null ] = args;

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_EMOJIS")) {

			if(name !== null || link !== null) {

				guild.emojis.create(link, name).then(emoji => {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Emoji :\`${name}\`: (${emoji.toString()}) created!`));

					if(audit) {
						const message = new MessageEmbed()
						.setColor(config[guild.id].theme.success)
						.setTitle("Emoji Added")
						.setFooter(`ID: ${emoji.id}`)
						.setTimestamp()
						.setThumbnail(link)
						.setDescription(`Moderator: <@!${sender.id}>\nName: :\`${name}\`:\nID: \`${emoji.id}\``)
						audit.send(message);
					}

				}).catch(function() {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`Emoji :\`${name}\`: could not be created!\nHave you used up all the emoji slots for this server?`));
				})

			} else {
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <name> <link>\``));
			}

		} else {
			channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
