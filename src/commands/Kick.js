module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("kick", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("KICK_MEMBERS")) {
			if(user !== "") {
				try {
					guild.member(userid).kick(reason.join(" ")).then(function() {

						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was kicked. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`));

						if(audit) {
							const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[userid].user;
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
						.setDescription(`I do not have permission to kick <@!${userid}>.`));
					})
				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> is no longer in this server.`));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user> [reason]\``));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
