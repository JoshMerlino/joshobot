module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("ban", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ user = "", deleteMessages = "false", reason = "" ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("BAN_MEMBERS")) {
			if(user !== "") {
				try {
					guild.member(userid).ban({ days: deleteMessages == true ? 7:0, reason }).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`User <@!${userid}> was banned. ${reason === "" ? "":"Reason: __" + reason + "__."}`));
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
