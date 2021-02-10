module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"role"
		], ...arguments);
		this.register(
			"Manage server roles. 🧻",
			HelpSection.MODERATION,
			[{
				argument: "add | create | delete | remove",
				required: true,
			}, {
				argument: "Role | @Role",
				required: true,
			}, {
				argument: "@User",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ subcommand = "", role = "", user = null ] = args;

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {

			if(role === "" || subcommand === "") {
				return channel.send(new MessageEmbed()
				.setColor(Color.warn)
				.setDescription(`Usage:\n\`${root} <add|remove|create|delete> <role> <@user | #color>\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			} else {

				if (subcommand.toLowerCase() === "add") {

					const roleid = (await util.role(role, guild)).id;
					const userid = user.replace(/[\\<>@#&!]/g, "");

					guild.member(userid).roles.add(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(Color.success)
						.setDescription(`Added <@&${roleid}> to <@!${userid}>`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(Color.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})

				} else if (subcommand.toLowerCase() === "remove") {

					const roleid = (await util.role(role, guild)).id;
					const userid = user.replace(/[\\<>@#&!]/g, "");

					guild.member(userid).roles.remove(roleid).then(function() {
						channel.send(new MessageEmbed()
						.setColor(Color.success)
						.setDescription(`Removed <@&${roleid}> from <@!${userid}>`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(Color.error)
						.setDescription(`Missing Permissions.\nIs the ${guild.member(client.user).roles.highest.toString()} role higher than <@&${roleid}> role?`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					})

				} else if (subcommand.toLowerCase() === "create") {

					await guild.roles.create({
					  	data: {
					    	name: args[1],
					    	color: args[2] || "#000000",
					  	}
				  	})

					channel.send(new MessageEmbed()
					.setColor(Color.success)
					.setDescription(`Created role \`${args[1]}\`.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

				} else if (subcommand.toLowerCase() === "delete") {

					const roleid = (await util.role(role, guild)).id;
					const specimin = await guild.roles.fetch(roleid);

					channel.send(new MessageEmbed()
					.setColor(Color.success)
					.setDescription(`Deleted role \`${specimin.name}\`.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));

					await specimin.delete();

				} else {
					return channel.send(new MessageEmbed()
					.setColor(Color.warn)
					.setDescription(`Usage:\n\`${root} <add|remove|create|delete> <role> <@user | #color>\``)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(Color.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
