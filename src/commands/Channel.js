module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("channel", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, message }) {

		const [ subcommand = "", ch = "", name = "" ] = args;

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_CHANNELS")) {

			if(subcommand === "") {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <add|remove|rename|nsfw> <channel|#channel> [name]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			} else {

				if (subcommand.toLowerCase() === "add") {

					if(ch === "") {
						return channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.warn)
						.setDescription(`Usage:\n\`${root} add <name>\``)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}

					const created = await guild.channels.create(ch);
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Created added ${created.toString()}.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} else if (subcommand.toLowerCase() === "remove") {

					if(channel === "") {
						return channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.warn)
						.setDescription(`Usage:\n\`${root} remove <#channel, ...>\``)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}

					message.mentions.channels.forEach(async channel => {
		                await channel.delete().catch(() => {
		                    return channel.send(new MessageEmbed()
							.setColor(guildConfig.theme.warn)
							.setDescription(`Unable to remove channel ${channel.name}`)
							.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		                })
		            })

					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Removed channels.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} else if (subcommand.toLowerCase() === "rename") {

					const specimen = message.mentions.channels.first();
					specimen.edit({ name: name.toLowerCase().replace(/\s/g, "-") });
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Renamed channel ${specimen.toString()}.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} else if (subcommand.toLowerCase() === "nsfw") {

					const specimen = message.mentions.channels.first() || channel;
					const { nsfw } = specimen;
					specimen.edit({ nsfw: !nsfw });
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`Channel ${specimen.toString()} is ${nsfw ? "no longer":"now"} NSFW.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} else {
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Usage:\n\`${root} <add|remove|rename|nsfw> <channel|#channel> [new name]\``)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
