module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"mute",
			"m"
		], ...arguments);
		this.register(
			"Mute a member in this server. 🔇",
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

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return await util.noPermission(channel, sender);

		// Get arguments
		const [ user = null, duration = null, ...reason ] = args;

		// Get default mute time
		let mutetime = 0;
		if(duration !== null) mutetime = ms(duration);

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Mute")
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());

		// If not enough params
		if(user === null) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		// get guild member
		const member = util.user(user, guild);

		// Get mute role
		const muterole = (await util.getMuteRole(guild)).id;

		member.roles.add(muterole).then(async function() {
			embed.setColor(Color.success);
			embed.addField("User", member.toString(), true);
			embed.addField("Duration", duration === null ? "Indeterminatly":cms(mutetime), true);
			reason.length > 0 && embed.addField("Reason", reason.join(" "), true);

			if (duration !== null) {
				config[guild.id].commands.mute.persistance = config[guild.id].commands.mute.persistance.filter(({ specimen }) => specimen !== member.id);
				config[guild.id].commands.mute.persistance.push({ moderator: sender.id, specimen: member.id, expires: Date.now() + mutetime, channel: channel.id });
				await util.writeConfig(guild.id)
			}

			return await channel.send(embed);
		}).catch(async error => {
			embed.setColor(Color.error);
			embed.addField("Error", error.toString(), true)
            return await channel.send(embed);
		})

	}

}
