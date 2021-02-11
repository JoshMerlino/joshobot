const toHsl = require("hex-to-hsl");

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"color"
		], ...arguments);
		this.register(
			"Preview a color. 🎨",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "#RRGGBB",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, channel, guild }) {

		// Parse arguments
		const [ color = "" ] = args;

		// Set hex
		let hex = null;

		// If is a hex color
		if(color.match(/^#?(([0-9a-fA-F]{2}){3})$/gm)) {
			hex = color.replace(/\#/gm, "").toLowerCase();
		}

		// If is a ping of a user
		if(color !== "" && util.user(color, guild) !== null) {
			hex = (await util.user(color, guild)).displayHexColor.replace(/\#/gm, "");
		}

		// If is a role
		if(color !== "" && util.role(color, guild) !== null) {
			hex = (await util.role(color, guild)).hexColor.replace(/\#/gm, "");
		}

		// If no color create random
		if(hex === null) {
			const h = () => Math.floor(Math.random()*256).toString(16).padStart(2, "0");
			hex = `${h()}${h()}${h()}`;
		}

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setTitle("Color");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL());
		embed.setThumbnail(`https://singlecolorimage.com/get/${hex}/100x100`)
		embed.addField("Integer", `\`${parseInt(hex, 16)}\``, true)
		embed.addField("Hex", `\`#${hex}\``, true)
		embed.addField("RGB", `\`rgb(${parseInt(hex.substr(0,2), 16)}, ${parseInt(hex.substr(2,2), 16)}, ${parseInt(hex.substr(4,2), 16)})\``, true)
		embed.addField("HSL", `\`hsl(${toHsl(`#${hex}`).join(", ")})\``, true)
		return await channel.send(embed);

	}

}
