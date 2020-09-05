module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("ban", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", deleteMessages = "false", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("BAN_MEMBERS")) {
			if(user !== "") {
				try {
					guild.member(userid).ban({ days: deleteMessages == true ? 7:0, reason: reason.join(" ") }).then(function() {

						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was banned. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`));

						if(audit) {
							const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[userid].user;
							const message = new MessageEmbed()
							.setColor(config[guild.id].theme.severe)
							.setTitle("User Banned")
							.setFooter(`ID: ${userid}`)
							.setTimestamp()
							.setThumbnail(User.displayAvatarURL())
							.setDescription(`Moderator: <@!${sender.id}>\nUser: <@!${userid}>\n\nReason: \`${reason.length === 0 ? "no reason" : reason.join(" ")}\`\nDeleted Messages: \`${deleteMessages == true ? "yes":"no"}\``)
							audit.send(message);
						}

					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`I do not have permission to ban <@!${userid}>.`));
					})
				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> has already been banned or left on their own.`));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user> [deleteMessages = false] [reason]\``));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
