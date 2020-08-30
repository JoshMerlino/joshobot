module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("help", ...arguments);
	}

	onCommand({ root, args, sender, channel, guildConfig }) {

		// If no arguments were specified
		if (args.length === 0) {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			.setFooter(`Created by JoshM#0001 & Jeremy#2000`)
			.addField("Moderator commands", `\`${root} moderator\``, true)
			return channel.send(embed);
		}

		if(args[0].toLowerCase() === "moderator") {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			guildConfig.commands["ban"].enabled && embed.addField("Ban user", `\`${guildConfig.prefix}${guildConfig.commands["ban"].alias[0]} <@user> [deleteMessages = true] [reason]\``, true)
			return channel.send(embed);
		}

		// If the subcommand dosnt exist
		return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.warn)
		.setDescription(`Unknown help chapter **${args.join(" ")}**.\nUse \`${config.prefix}${config.commands[command].command}\` for a list of commands.`));

	}

}
