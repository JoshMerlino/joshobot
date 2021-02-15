module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"namemc",
			"mc"
		], ...arguments);
		this.register(
			"Look up a Minecraft player. 🎮",
			HelpSection.FUN,
			[{
				argument: "Username",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// If no args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get arguments
		const [ mcname ] = args;

		// Start typing
		channel.startTyping();

		// Lookup user
		const mcuser = await fetch(`https://joshm.us.to/api/namemc/v1/lookup?query=${mcname}`)
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping());

		// Set up embed
		const embed = new MessageEmbed();
		embed.setTitle("Name MC Lookup")
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// If no user found
		if(mcuser.success === false) {
			embed.setColor(Color.error)
			embed.setDescription(mcuser.error)
			return await channel.send(embed)
		}

		// Send embed
		embed.setURL(`https://mine.ly/${mcuser.profileId}`);
		embed.setTitle(mcuser.currentName);
		embed.setColor(Color.info);
		embed.addField("UUID", `\`${mcuser.uuid}\``);
		embed.addField("Previous Names", mcuser.pastNames.map(({ name }) => `\`${name}\``), true);
		embed.addField("Changed At", mcuser.pastNames.map(({ changedAt }) => `${changedAt !== null ? util.ts(changedAt) : "*Never*"}`), true);
		embed.setThumbnail(mcuser.imageUrls.head);
		return await channel.send(embed)

	}

}
