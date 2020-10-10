module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("mute", ...arguments);
		this.register("Mute a member in this server. 🔇", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", duration = null, ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		let mutetime = 0;
		if(duration !== null) mutetime = ms(duration);

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {

			// Find a mute role or generate one if one wasnt found
			let muterole = config[guild.id].commands["mute"].muterole;
			if(!Object.keys(util.parseCollection(guild.roles.cache)).includes(muterole)) muterole = null
			if(Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`).length > 0) muterole = Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`)[0].id
			if(!muterole) muterole = (await guild.roles.create({ data: { color: guildConfig.theme.dunce, name: `Muted (Josh O' Bot)` }, reason: "Create a role for muted users - Josh O' Bot" })).id;

			// Ensure role is saved
			config[guild.id].commands.mute.muterole = muterole;
			await util.writeConfig(guild.id);

			// Configure all channels to deny sending
			const role = await guild.roles.fetch(muterole);
			Object.values(util.parseCollection(guild.channels.cache)).map(async ch => {
				if(channel.permissionsLocked !== true) {
					await ch.updateOverwrite(role, {
						SEND_MESSAGES: false,
						EMBED_LINKS: false,
						ATTACH_FILES: false,
					})
				}
			})

			if(user !== "") {
				try {
					guild.member(userid).roles.add(muterole).then(async function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.severe)
						.setDescription(`User <@!${userid}> was muted for ${duration === null ? "for an eternity": cms(mutetime)}. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));

						if (duration !== null) {
							config[guild.id].commands.mute.persistance = config[guild.id].commands.mute.persistance.filter(({ specimen }) => specimen !== userid);
							config[guild.id].commands.mute.persistance.push({ moderator: sender.id, specimen: userid, expires: Date.now() + mutetime, channel: channel.id });
							await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");
						}

					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`User <@!${userid}> can not be muted.`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					});

				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> can not be muted.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
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
