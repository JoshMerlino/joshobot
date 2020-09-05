module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("unmute", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "" ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_ROLES")) {

			let muterole = config[guild.id].commands["mute"].muterole;

			if(user !== "") {
				try {

					guild.member(userid).roles.remove(muterole);
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`<@!${userid}> is no longer muted.`));

					if(audit) {
						const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[userid].user;
						const message = new MessageEmbed()
						.setColor(config[guild.id].theme.severe)
						.setTitle("User Unmuted")
						.setFooter(`ID: ${userid}`)
						.setTimestamp()
						.setThumbnail(User.displayAvatarURL())
						.setDescription(`Moderator: <@!${sender.id}>`)
						audit.send(message);
					}

				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> can not be unmuted.`));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user>\``));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
