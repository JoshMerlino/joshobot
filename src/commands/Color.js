module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"color"
		], ...arguments);
		this.register(
			"Preview a color. 🎨",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "@User | #RRGGBB",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, channel, guild }) {

		// Parse arguments
		const [ userorcolor ] = args;

		// Generate random color as fallback
		const h = () => Math.floor(Math.random()*256).toString(16).padStart(2, "0");
		let color = `#${h()}${h()}${h()}`;

		try {
			// Attempt to make color the color of the pinged user
			color = (await util.user(userorcolor, guild)).displayHexColor;
		} catch (err) {
			// If failed make sure the color is in hex format
			if(args[0]) color = "#" + args[0].replace(/\#/g, "");
		}

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(color);
		embed.setTitle("Color");
		embed.addField("Integer", `\`${parseInt(color.split("#")[1], 16)}\``, true)
		embed.addField("Hex", `\`${color.toUpperCase()}\``, true)
		embed.addField("RGB", `\`${parseInt(color.split("#")[1].substr(0,2), 16)}, ${parseInt(color.split("#")[1].substr(2,2), 16)}, ${parseInt(color.split("#")[1].substr(4,2), 16)}\``, true)
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
		return await channel.send(embed);

	}

}
