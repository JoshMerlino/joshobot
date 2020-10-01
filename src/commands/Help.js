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
			.setFooter(`Built by Josh and Jeremy`)
			.addField("Fun commands", `\`${root} fun\``, true)
			.addField("Moderator commands", `\`${root} moderator\``, true)
			.setURL("https://josho.bot.nu/")
			.setTitle("Configure Online")
			return channel.send(embed);
		}

		if(["moderator", "mod", "m"].includes(subcommand.toLowerCase())) {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			.setFooter(sender.displayName, sender.user.displayAvatarURL())
			guildConfig.commands["addemoji"].enabled && embed.addField("Add Emoji", `\`${guildConfig.prefix}${guildConfig.commands["addemoji"].alias[0]} <name> [link = link from previous image]\``)
			guildConfig.commands["audit"].enabled && embed.addField("Manage Audit Log", `\`${guildConfig.prefix}${guildConfig.commands["audit"].alias[0]} <channel|enable|disable> [#channel (channel)]\``)
			guildConfig.commands["ban"].enabled && embed.addField("Ban Members", `\`${guildConfig.prefix}${guildConfig.commands["ban"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["botmaster"].enabled && embed.addField("Bot Masters", `\`${guildConfig.prefix}${guildConfig.commands["botmaster"].alias[0]} <@role>\``)
			guildConfig.commands["channel"].enabled && embed.addField("Manage Channels", `\`${guildConfig.prefix}${guildConfig.commands["channel"].alias[0]} <add|remove|rename|nsfw> <channel|#channel> [new name]\``)
			guildConfig.commands["kick"].enabled && embed.addField("Kick Members", `\`${guildConfig.prefix}${guildConfig.commands["kick"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["lockdown"].enabled && embed.addField("Lockdown Channel", `\`${guildConfig.prefix}${guildConfig.commands["lockdown"].alias[0]} [#channel = (current)]\``)
			guildConfig.commands["mute"].enabled && embed.addField("Mute Members", `\`${guildConfig.prefix}${guildConfig.commands["mute"].alias[0]} <@user> (reason)\``)
			guildConfig.commands["purge"].enabled && embed.addField("Purge Messages", `\`${guildConfig.prefix}${guildConfig.commands["purge"].alias[0]} <length>\``)
			guildConfig.commands["role"].enabled && embed.addField("Manage Roles", `\`${guildConfig.prefix}${guildConfig.commands["role"].alias[0]} <add|remove> <role> <@user>\``)
			guildConfig.commands["unmute"].enabled && embed.addField("Unmute Members", `\`${guildConfig.prefix}${guildConfig.commands["unmute"].alias[0]} <@user>\``)
			guildConfig.commands["warn"].enabled && embed.addField("Warn Members", `\`${guildConfig.prefix}${guildConfig.commands["warn"].alias[0]} <@user> [reason]\``)
			return channel.send(embed);
		}

		if(["fun", "f"].includes(subcommand.toLowerCase())) {
			const embed = new MessageEmbed()
			.setColor(guildConfig.theme.primary)
			.setFooter(sender.displayName, sender.user.displayAvatarURL())
			guildConfig.commands["8ball"].enabled && embed.addField("8 Ball", `\`${guildConfig.prefix}${guildConfig.commands["8ball"].alias[0]} <question ...>\``)
			guildConfig.commands["advice"].enabled && embed.addField("Advice", `\`${guildConfig.prefix}${guildConfig.commands["advice"].alias[0]}\``)
			guildConfig.commands["avatar"].enabled && embed.addField("Avatar", `\`${guildConfig.prefix}${guildConfig.commands["avatar"].alias[0]} (@user = you)\``)
			guildConfig.commands["color"].enabled && embed.addField("Color", `\`${guildConfig.prefix}${guildConfig.commands["color"].alias[0]} [hex code | @user]\``)
			guildConfig.commands["image"].enabled && embed.addField("Image Search", `\`${guildConfig.prefix}${guildConfig.commands["image"].alias[0]} <term>\``)
			guildConfig.commands["namemc"].enabled && embed.addField("Name MC Lookup", `\`${guildConfig.prefix}${guildConfig.commands["namemc"].alias[0]} <minecraft username>\``)
			guildConfig.commands["poll"].enabled && embed.addField("Create Poll", `\`${guildConfig.prefix}${guildConfig.commands["poll"].alias[0]} <message>\``)
			guildConfig.commands["reddit"].enabled && embed.addField("Reddit Search", `\`${guildConfig.prefix}${guildConfig.commands["reddit"].alias[0]} <term>\``)
			guildConfig.commands["urban"].enabled && embed.addField("Urban Dictionary", `\`${guildConfig.prefix}${guildConfig.commands["urban"].alias[0]} <term>\``)
			guildConfig.commands["user"].enabled && embed.addField("User Information", `\`${guildConfig.prefix}${guildConfig.commands["user"].alias[0]} [@user = you]\``)
			return channel.send(embed);
		}

		// If the subcommand dosnt exist
		return channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.warn)
		.setFooter(sender.displayName, sender.user.displayAvatarURL())
		.setDescription(`Invalid subcommand **${args[0]}**.\nUse \`${config.prefix}${config.commands[command].command}\` for a list of commands.`));

	}

}
