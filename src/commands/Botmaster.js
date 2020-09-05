module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("botmaster", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ subcommand = "", role = "" ] = args;
		const roleid = role.replace(/[\\<>@#&!]/g, "");

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_ROLES")) {

			if(role === "" || subcommand === "") {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <add|remove> <@role>\``));
			} else {
				if(subcommand.toLowerCase() === "add") {

					config[guild.id].botmasters.push(roleid);
					await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`<@&${roleid}> is now a bot master.`));

					if(audit) {
						const message = new MessageEmbed()
						.setColor(config[guild.id].theme.warn)
						.setTitle("Bot Masters Updated")
						.setFooter(`ID: ${sender.id}`)
						.setTimestamp()
						.setDescription(`Moderator: <@!${sender.id}>\nRoles: ${config[guild.id].botmasters.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`)
						audit.send(message);
					}


				} else if (subcommand.toLowerCase() === "remove") {

					config[guild.id].botmasters.splice(config[guild.id].botmasters.indexOf(roleid));
					await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.success)
					.setDescription(`<@&${roleid}> is no longer a bot master.`));

					if(audit) {
						const message = new MessageEmbed()
						.setColor(config[guild.id].theme.warn)
						.setTitle("Bot Masters Updated")
						.setFooter(`ID: ${sender.id}`)
						.setTimestamp()
						.setDescription(`Moderator: <@!${sender.id}>\nRoles: ${config[guild.id].botmasters.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`)
						audit.send(message);
					}

				} else {
					return channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.warn)
					.setDescription(`Usage:\n\`${root} <add|remove> <@role>\``));
				}
			}

		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
