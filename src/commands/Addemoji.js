module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"addemoji",
			"ae"
		], ...arguments);
		this.register(
			"Creates a new server emoji. 💩",
			HelpSection.MODERATION,
			[{
				argument: "Emoji name",
				required: true,
			}, {
				argument: "Emoji link",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_EMOJIS")) return await util.noPermissions(channel, sender);

		// Get params
		let [ name = null, link = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Add Emoji")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If not enough arguments, send default message
		if(name === null) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		// If no link, get previous message image
		if(link === null) {
			let messages = Object.values(util.parseCollection(await channel.messages.fetch({ limit: 24 })))
			messages = messages.filter(message => Object.values(util.parseCollection(message.attachments)).length > 0);
			link = Object.values(util.parseCollection(messages[0].attachments))[0].attachment;
		}

		// If no link at all
		if(!link.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)) {
			embed.setColor(Color.error)
			embed.addField("Error", `The link to the emoji image wasn't found.`, true)
			return await channel.send(embed)
		}

		guild.emojis.create(link, name).then(async emoji => {

			// On successful emoji create
			embed.setTitle("Created Emoji")
			embed.setColor(Color.success)
			embed.addField("Emoji", `\`:${emoji.name}:\``, true)
			embed.addField("Preview", emoji.toString(), true)
			return await channel.send(embed);

		}).catch(async error => {

			// If error creating emoji
			embed.setTitle("Error Making Emoji")
			embed.setColor(Color.error)
			embed.addField("Error", error.toString().split(":")[2], true);
			await channel.send(embed);

		})

	}

}
