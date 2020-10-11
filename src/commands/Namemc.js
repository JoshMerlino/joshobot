const { lookupName } = require("namemc")

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("namemc", ...arguments);
		this.register("Look up a Minecraft player. 🎮", HelpSection.MISCELLANEOUS, [{
			argument: "Username",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel }) {

		const [ mcname ] = args;

		const embed = new MessageEmbed();
		embed.setTitle("Minecraft Account Lookup")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		if(args.length !== 1) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		try {
			const [ mcuser ] = await lookupName(mcname);
			embed.setURL(`https://mine.ly/${mcuser.profileId}`);
			embed.setTitle(mcuser.currentName);
			embed.setColor(guildConfig.theme.info);
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
