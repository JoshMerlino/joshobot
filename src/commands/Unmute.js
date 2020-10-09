module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("unmute", ...arguments);
		this.register("Unmute a member in this server. 🔊", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "" ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {

			let muterole = config[guild.id].commands["mute"].muterole;

			if(user !== "") {
				try {

					guild.member(userid).roles.remove(muterole);
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`<@!${userid}> is no longer muted.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> can not be unmuted.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user>\``)
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
