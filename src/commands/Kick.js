module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("kick", ...arguments);
		this.register("Kick a member from the server. 🥾", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "KICK_MEMBERS")) {
			if(user !== "") {
				try {
					guild.member(userid).kick(reason.join(" ")).then(function() {

						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was kicked. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));

						if(audit) {
							const User = util.parseCollection(guild.members.cache)[userid].user;
							const message = new MessageEmbed()
							.setColor(config[guild.id].theme.severe)
							.setTitle("User Kicked")
							.setFooter(`ID: ${userid}`)
							.setTimestamp()
							.setThumbnail(User.displayAvatarURL())
							.setDescription(`Moderator: <@!${sender.id}>\nUser: <@!${userid}>\n\nReason: \`${reason.length === 0 ? "no reason" : reason.join(" ")}\``)
							audit.send(message);
						}

					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`I do not have permission to kick <@!${userid}>.`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})
				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> is no longer in this server.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user> [reason]\``)
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
