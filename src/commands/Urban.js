module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"urban",
			"urbandictionary",
			"ur"
		], ...arguments);
		this.register(
			"Look up a term from Urban Dictionary. 📘",
			HelpSection.FUN,
			[{
				argument: "Term",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// Begin setting up embed
		const embed = new MessageEmbed();
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setColor(Color.info);
		embed.setTitle("Urban Dictionary");

		// Get word to look up
		const term = args.join(" ");

		// Show typing
		channel.startTyping();

		// Get image from bing
		const { definition, thumbs_up, thumbs_down, example, image } = await fetch(`https://joshm.us.to/api/v1/define?search=${encodeURIComponent(term)}`)
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping())

		// If image is applicable
		if(image) embed.setThumbnail(image);

		// Add to embed
		embed.setDescription(`${definition.replace(/\[|\]/gm, "**")}\n\n${example.replace(/\[|\]/gm, "**")}\n\n👍 **${thumbs_up}** • 👎 **${thumbs_down}**`);

		// Send embed
		return await channel.send(embed);

	}

}
