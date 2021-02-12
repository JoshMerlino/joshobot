const link = `https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot`;

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"invite",
			"inv"
		], ...arguments);
		this.register(
			"Invite Josh O' Bot to your server. 😍",
			HelpSection.GENERAL
		);
	}

	async onCommand({ sender, channel }) {

		// Formulate Embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setTitle("Click to Invite");
		embed.setURL(link)
		embed.setDescription(`Invite ${client.user.toString()} to your server for epic\nmoderation tools and other fun goodies! 😎`)
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		channel.send(embed)

	}

}
