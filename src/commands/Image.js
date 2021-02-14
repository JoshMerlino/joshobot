module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"image",
			"im",
			"i"
		], ...arguments);
		this.register(
			"Google image search. 🖼",
			HelpSection.GENERAL,
			[{
				argument: "Search query",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// convert args to term
		const term = args.join(" ");

		// Show typing
		channel.startTyping();

		// Get images from bing
		const { value } = await fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=${encodeURIComponent(term)}`, {
		    headers: {
		        "x-rapidapi-key": process.env.RAPID_API_KEY,
		        useQueryString: true
		    }
		}).then(resp => resp.json())
		  .finally(() => channel.stopTyping())

		// Pick a random image from search
		const image = value[Math.floor(Math.random() * value.length)];

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle(`Image Search for "${term}"`);
		embed.setDescription(image.name)
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp()
		embed.setColor(`#${image.accentColor}`);
		embed.setImage(image.contentUrl);
		return await channel.send(embed);

	}

}
