module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("poll", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const msg = args.join(" ");

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
		embed.setTitle(msg);

		channel.send(embed).then(async m => {
            await m.react("✅");
            await m.react("❌");
        });

	}

}
