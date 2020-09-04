module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("kick", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ user = "", ...reason = "" ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("KICK_MEMBERS")) {
			if(user !== "") {
				try {
					guild.member(userid).kick(reason).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was kicked. ${reason === "" ? "":"Reason: __" + reason + "__."}`));
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
				.setDescription(`Usage:\n\`${root} <@user> [deleteMessages = false] [reason]\``));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
