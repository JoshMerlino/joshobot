module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("skip", ...arguments);
		this.register("Skips to the next song in queue. ⏭", HelpSection.MUSIC);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const stream = streams[guild.id];
		if(stream === undefined) return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.info)
		.setDescription(`Nothing to skip.`)
		.setFooter(sender.displayName, sender.user.displayAvatarURL()));

		stream.skip();

	}

}
