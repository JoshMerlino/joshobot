module.exports = class Command extends require("../Command.js") {
	constructor() {
		super([
			"suggest"
		], ...arguments);
		this.register(
			"Makes a suggestion in our Josh O' Bot support server. 😍",
			HelpSection.GENERAL,
			[{
				argument: "Suggestion",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		if(args.length === 0) {
			return channel.send(new MessageEmbed()
			.setColor(Color.warn)
			.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp()
	        .setDescription(`Suggestions can not be blank.`));
		}

		const msg = args.join(" ");

		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setFooter(`${sender.user.tag} • ${sender.id}`, sender.user.displayAvatarURL());
        embed.setTitle("New Suggestion!")
        embed.setDescription(msg);
		embed.setTimestamp();

		client.channels.resolve("763197400168661022").send(embed).then(async m => {
            await m.react("✅");
            await m.react("❌");
        });

		return channel.send(new MessageEmbed()
		.setColor(Color.success)
		.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp()
        .setDescription(`We have recieved your suggestion. Thanks for helping improve Josh O' Bot`));

	}
}
