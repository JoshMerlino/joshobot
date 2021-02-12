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
				argument: "Duration",
				required: false,
			}, {
				argument: "Reason",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get arguments
		const [ user, duration = null, ...reason ] = args;

		// Get mute duration
		const mutetime = duration === null ? 0 : ms(duration);

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Mute")
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());

		// Get member
		const member = util.user(user, guild);

		// Get mute role
		const muterole = (await util.getMuteRole(guild)).id;

		// Add role to member
		member.roles.add(muterole).then(async function() {

			embed.setColor(Color.success);
			embed.setDescription(`Muted ${member.toString()}${reason.length > 0 ? " for ":""}${reason.join(" ")}. Expires ${duration === null ? "never":`in ${cms(mutetime)}`}.`);

			if (duration !== null) {

				// Override existing mutes the user may have
				config[guild.id].commands.mute.persistance = config[guild.id].commands.mute.persistance.filter(({ specimen }) => specimen !== member.id);

				// Queue new unmute
				config[guild.id].commands.mute.persistance.push({ moderator: sender.id, specimen: member.id, expires: Date.now() + mutetime, channel: channel.id });

				// Write config to disk
				await util.writeConfig(guild.id);

			}

		}).catch(error => {
			embed.setColor(Color.error);
			embed.setDescription(`${member.toString()} is not able to be muted.\n${error.toString().split(":")[2]}`);
		}).finally(async () =>  await channel.send(embed));

	}

}
