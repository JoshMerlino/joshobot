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
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_EMOJIS")) return;

		// If no args, send usage
		if(args.length === 0) return await this.sendUsage(channel);

		// Get params
		let [ name = null, link = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());

		// If no link, get previous message image
		if(link === null) {
			let messages = Object.values(util.parseCollection(await channel.messages.fetch({ limit: 24 })))
			messages = messages.filter(message => Object.values(util.parseCollection(message.attachments)).length > 0);
			link = Object.values(util.parseCollection(messages[0].attachments))[0].attachment;
		}

		// If no link at all
		if(!link.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)) {
			embed.setColor(Color.error);
			embed.setDescription(`The link to the emoji image wasn't found.`);
			return await channel.send(embed);
		}

		guild.emojis.create(link, name).then(emoji => {

			// On successful emoji create
			embed.setTitle("Emoji added");
			embed.setColor(Color.success);
			embed.setDescription(`Added emoji \`:${emoji.name}:\` ${emoji.toString()}`);

		}).catch(error => {

			// If error creating emoji
			embed.setTitle("Couldn't add Emoji");
			embed.setColor(Color.error);
			embed.setDescription(error.toString().split(":")[2]);

		}).finally(async () => await channel.send(embed))

	}

}
