module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("role", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ subcommand = "", role = "", user = null ] = args;
		const roleid = role.replace(/[\\<>@#&!]/g, "");
		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_ROLES")) {

			if(role === "" || subcommand === "" || user === null) {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <add|remove> <@role> <@user>\``));
			} else {

				if (subcommand.toLowerCase() === "add") {

					guild.member(userid).roles.add(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`Added <@&${roleid}> to <@!${userid}>`));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`));
					})

				} else if (subcommand.toLowerCase() === "remove") {

					guild.member(userid).roles.remove(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`Removed <@&${roleid}> from <@!${userid}>`));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`));
					})

				} else {
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Usage:\n\`${root} <add|remove> <@role> <@user>\``));
				}
			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
