module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("color", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const [ userorcolor ] = args;

		const h = () => Math.floor(Math.random()*256).toString(16).padStart(2, "0");
		let color = `#${h()}${h()}${h()}`;

		try {
			const member = await guild.members.fetch(userorcolor.replace(/[\\<>@#&!]/g, ""));
			color = member.displayHexColor;
		} catch (err) {
			if(args[0]) {
				color = "#" + args[0].replace(/\#/g, "");
			}
		}

		const embed = new MessageEmbed();
		embed.setColor(color);
		embed.setTitle(`${color.toUpperCase()}`);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		await channel.send(embed);

	}

}
