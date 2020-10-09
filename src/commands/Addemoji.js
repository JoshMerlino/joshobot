module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("addemoji", ...arguments);
		this.register("Creates a new server emoji. 💩", HelpSection.MODERATION, [{
			argument: "Emoji name",
			required: true,
		}, {
			argument: "Emoji link",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		let [ name = null, link = null ] = args;

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_EMOJIS")) {

			if(name !== null) {

				if(link === null) {
					let messages = Object.values(util.parseCollection(await channel.messages.fetch({ limit: 24 })))
					messages = messages.filter(message => {
						const attachments = Object.values(util.parseCollection(message.attachments));
						return attachments.length > 0;
					});
					const { attachment } = Object.values(util.parseCollection(messages[0].attachments))[0];
					link = attachment;
				}

				if(!link.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)) {
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`It appears you've entered an invalid URL for this emoji.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}

				guild.emojis.create(link, name).then(emoji => {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Emoji \\:${name}: ${emoji.toString()} created!`));
				}).catch(function(err) {
					console.error(err);
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`Emoji :\`${name}\`: could not be created!\nYou must have used up all the emoji slots for\nthis serveror the emoji is greater than \`256 kB\`.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				})

			} else {
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <name> [link]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			}

		} else {
			channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
