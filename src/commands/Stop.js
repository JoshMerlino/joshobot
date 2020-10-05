module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("stop", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const stream = streams[guild.id];
		const { dispatcher, voice } = stream;

		if(stream === undefined) return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.info)
		.setDescription(`Not playig.`)
		.setFooter(sender.displayName, sender.user.displayAvatarURL()));

		dispatcher.destroy();
		voice.leave();
		streams[guild.id] = undefined;

		return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.info)
		.setDescription(`Disconnected.`)
		.setFooter(sender.displayName, sender.user.displayAvatarURL()));

	}

}
