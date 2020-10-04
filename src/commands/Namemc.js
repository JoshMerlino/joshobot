const { lookupName } = require("namemc")

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("namemc", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ mcname ] = args;

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		try {
			const [ mcuser ] = await lookupName(mcname);
			embed.setURL(`https://mine.ly/${mcuser.profileId}`);
			embed.setTitle(mcuser.currentName);
			embed.addField("UUID", `\`${mcuser.uuid}\``);
			embed.addField("Previous Names", mcuser.pastNames.map(({ name }) => `\`${name}\``), true);
			embed.addField("Changed At", mcuser.pastNames.map(({ changedAt }) => `${changedAt !== null ? "`" + dayjs(changedAt).fromNow() + "`" : "__Never__"}`), true);
			embed.setThumbnail(mcuser.imageUrls.head);
			embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
			return channel.send(embed)
		} catch(e) {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`Minecraft user "${mcname}" was not found!`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()))
		}

	}

}
