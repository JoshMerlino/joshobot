module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("warn", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_ROLES")) {
			if(user !== "") {
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.severe)
				.setDescription(`User <@!${userid}> has been warned. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`));

				if(audit) {
					const User = Array.from(guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[userid].user;
					const message = new MessageEmbed()
					.setColor(config[guild.id].theme.severe)
					.setTitle("User Warned")
					.setFooter(`ID: ${userid}`)
					.setTimestamp()
					.setThumbnail(User.displayAvatarURL())
					.setDescription(`Moderator: <@!${sender.id}>\nReason: \`${reason.length === 0 ? "no reason" : reason.join(" ")}\``)
					audit.send(message);
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
