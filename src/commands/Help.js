module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("help", ...arguments);
	}

	onCommand({ root, args, sender, channel, guildConfig }) {

		const [ subcommand ] = args;

		// If no arguments were specified
		if (args.length === 0) {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			.setFooter(`Built by Josh`)
			.addField("Moderator commands", `\`${root} moderator\``, true)
			return channel.send(embed);
		}

		if(subcommand.toLowerCase() === "moderator" || subcommand.toLowerCase() === "mod" || subcommand.toLowerCase() === "m") {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			guildConfig.commands["addemoji"].enabled && embed.addField("Add Emoji", `\`${guildConfig.prefix}${guildConfig.commands["addemoji"].alias[0]} <name> <link>\``)
			guildConfig.commands["audit"].enabled && embed.addField("Manage Audit Log", `\`${guildConfig.prefix}${guildConfig.commands["audit"].alias[0]} <channel|enable|disable> [#channel (channel)]\``)
			guildConfig.commands["ban"].enabled && embed.addField("Ban Members", `\`${guildConfig.prefix}${guildConfig.commands["ban"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["botmaster"].enabled && embed.addField("Bot Masters", `\`${guildConfig.prefix}${guildConfig.commands["botmaster"].alias[0]} <@role>\``)
			guildConfig.commands["kick"].enabled && embed.addField("Kick Members", `\`${guildConfig.prefix}${guildConfig.commands["kick"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["lockdown"].enabled && embed.addField("Lockdown Channel", `\`${guildConfig.prefix}${guildConfig.commands["lockdown"].alias[0]} [#channel = (current)]\``)
			guildConfig.commands["mute"].enabled && embed.addField("Mute Members", `\`${guildConfig.prefix}${guildConfig.commands["mute"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["purge"].enabled && embed.addField("Purge Messages", `\`${guildConfig.prefix}${guildConfig.commands["purge"].alias[0]} <length>\``)
			guildConfig.commands["unmute"].enabled && embed.addField("Unmute Members", `\`${guildConfig.prefix}${guildConfig.commands["unmute"].alias[0]} <@user>\``)
			guildConfig.commands["warn"].enabled && embed.addField("Warn Members", `\`${guildConfig.prefix}${guildConfig.commands["warn"].alias[0]} <@user> [reason]\``)
			return channel.send(embed);
		}

		// If the subcommand dosnt exist
		return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.warn)
		.setDescription(`Invalid subcommand **${args[0]}**.\nUse \`${config.prefix}${config.commands[command].command}\` for a list of commands.`));

	}

}
