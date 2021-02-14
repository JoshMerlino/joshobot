module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"urban",
			"urbandictionary",
			"ur"
		], ...arguments);
		this.register(
			"Look up a term from Urban Dictionary. 📘",
			HelpSection.GENERAL,
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
		const image = await fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${encodeURIComponent(term)}`, {
		    headers: {
		        "x-rapidapi-key": process.env.RAPID_API_KEY,
		        useQueryString: true
		    }
		}).then(resp => resp.json())
		  .then(({ value }) => value[Math.floor(Math.random() * value.length)].contentUrl)
		  .catch(() => false)
		  .finally(() => channel.stopTyping())

		// If image is applicable
		if(image) embed.setThumbnail(image);

		// Show typing
		channel.startTyping();

		// Get image from bing
		const { definition, thumbs_up, thumbs_down, example } = await fetch(`https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${encodeURIComponent(term)}`, {
		    headers: {
		        "x-rapidapi-key": process.env.RAPID_API_KEY
		    }
		}).then(resp => resp.json())
		  .then(({ list }) => list[0])
		  .finally(() => channel.stopTyping())

		// Add to embed
		embed.setDescription(`${definition.replace(/\[|\]/gm, "**")}\n\n${example.replace(/\[|\]/gm, "**")}\n\n👍 **${thumbs_up}** • 👎 **${thumbs_down}**`);

		// Send embed
		return await channel.send(embed);

	}

}
