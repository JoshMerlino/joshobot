module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("warn", ...arguments);
		this.register("Warns a user about an action they may have done. ⚠", HelpSection.MODERATION, [{
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
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {
			if(user !== "") {
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.severe)
				.setDescription(`User <@!${userid}> has been warned. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));

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
