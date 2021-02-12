module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"ban",
			"banish",
			"b"
		], ...arguments);
		this.register(
			"Bans a member from the server. 🔨",
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
		if(!util.hasPermissions(sender, guildConfig, "BAN_MEMBERS")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get params
		const [ user, ...reason ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Ban");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// get guild member to ban
		const member = util.user(user, guild);

		// If ban target has ban permissions
		if(util.hasPermissions(member, guildConfig, "BAN_MEMBERS")) {
			embed.setColor(Color.error);
			embed.setDescription(`${member.toString()} is not able to be banned.\nThey most likley have equal or greater permissions than you.`);
            return await channel.send(embed);
		}

		// Ban member
		member.ban({ days: 7, reason: reason.join(" ") }).then(async function() {
			embed.setColor(Color.success);
			embed.setDescription(`Banned ${member.toString()}${reason.length > 0 ? " for ":""}${reason.join(" ")}`);
		}).catch(async error => {
			embed.setColor(Color.error);
			embed.setDescription(`${member.toString()} is not able to be banned.\n${error.toString().split(":")[2]}`);
		}).finally(async () =>  await channel.send(embed));

	}

}
