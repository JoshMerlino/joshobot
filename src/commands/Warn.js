module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"warn",
			"w"
		], ...arguments);
		this.register(
			"Warns a user about an action they may have done. ⚠",
			HelpSection.MODERATION,
			[{
				argument: "@User",
				required: true,
			}, {
				argument: "Reason",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ user = "", ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {
			if(user !== "") {

				const persistance = guildConfig.commands.warn.persistance;
				persistance.push({ specimen: userid, moderator: sender.id, expires: Date.now() + 8.64e7 });

				channel.send(new MessageEmbed()
				.setColor(Color.severe)
				.setDescription(`User <@!${userid}> has been warned. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}\nThis is their ${ordinalize(persistance.filter(p => p.specimen === userid).length)} warning in the last 24 hours!`)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				config[guild.id].commands.warn.persistance = persistance;
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");

			} else {
				return channel.send(new MessageEmbed()
				.setColor(Color.warn)
				.setDescription(`Usage:\n\`${root} <@user> [reason]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(Color.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
