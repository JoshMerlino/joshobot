module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("ban", ...arguments);
		this.register("Bans a member from the server. 🔨", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", deleteMessages = "false", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");
		const member = guild.member(userid);

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "BAN_MEMBERS")) {
			if(user !== "") {
				try {

					if(util.hasPermissions(member, guildConfig, "BAN_MEMBERS")) {
						return channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`I do not have permission to ban <@!${userid}>.`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}

					member.ban({ days: deleteMessages == true ? 7:0, reason: reason.join(" ") }).then(function() {

						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was banned. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));

						if(audit) {
							const User = util.parseCollection(guild.members.cache)[userid].user;
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
						.setDescription(`I do not have permission to ban <@!${userid}>.`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})
				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> has already been banned or left on their own.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user> [deleteMessages = false] [reason]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
