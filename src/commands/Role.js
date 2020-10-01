module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("role", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ subcommand = "", role = "", user = null ] = args;

		let roleid;
		if(role.match(/<@&([0-9]*)>/g)) {
			roleid = role.replace(/[\\<>@#&!]/g, "");
		} else {
			roleid = Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name.toLowerCase().replace(/\s/g, "-") === role.toLowerCase())[0].id;
		}

		const userid = user.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {

			if(role === "" || subcommand === "" || user === null) {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <add|remove> <role> <@user>\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			} else {

				if (subcommand.toLowerCase() === "add") {

					guild.member(userid).roles.add(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`Added <@&${roleid}> to <@!${userid}>`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})

				} else if (subcommand.toLowerCase() === "remove") {

					guild.member(userid).roles.remove(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.success)
						.setDescription(`Removed <@&${roleid}> from <@!${userid}>`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})

				} else {
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Usage:\n\`${root} <add|remove> <@role> <@user>\``)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
