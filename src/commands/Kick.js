module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"kick",
			"k"
		], ...arguments);
		this.register(
			"Kick a member from the server. 🥾",
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
		if(!util.hasPermissions(sender, guildConfig, "KICK_MEMBERS")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get arguments
		const [ user, ...reason ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Kick")
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());

		// get guild member
		const member = util.user(user, guild);

		// If ban target has ban permissions
		if(util.hasPermissions(member, guildConfig, "KICK_MEMBERS")) {
			embed.setColor(Color.server);
			embed.setDescription(`${member.toString()} is not able to be kicked.\nThey most likley have equal or greater permissions than you.`);
            return await channel.send(embed);
		}

		// Ban member
		member.ban(reason.join(" ")).then(function() {
			embed.setColor(Color.success);
			embed.setDescription(`Kicked ${member.toString()}${reason.length > 0 ? " for ":""}${reason.join(" ")}`);
		}).catch(error => {
			embed.setColor(Color.error);
			embed.setDescription(`${member.toString()} is not able to be kicked.\n${error.toString().split(":")[2]}`);
		}).finally(async () =>  await channel.send(embed));

	}

}
