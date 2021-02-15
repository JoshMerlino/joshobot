module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"image",
			"im",
			"i"
		], ...arguments);
		this.register(
			"Google image search. 🖼",
			HelpSection.FUN,
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
		const { images } = await fetch(`https://joshm.us.to/api/v1/image?q=${encodeURIComponent(term)}`)
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping());


		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle(`Image Search for "${term}"`);
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp()
		embed.setColor(Color.info);

		// If no results
		if(images.length === 0) {
			embed.setColor(Color.error);
			embed.setDescription("No images found.");
			return await channel.send(embed);
		}

		// Filter based on NSFW channel needs
		const imagesFiltered = images.filter(({ nsfw }) => nsfw === channel.nsfw);

		// If no safe images are found
		if(channel.nsfw === false && imagesFiltered.length === 0) {
			embed.setColor(Color.error);
			embed.setDescription(`No safe images found. \nTo make this an NSFW channel do \`${guildConfig.prefix}ch nsfw\``);
			return await channel.send(embed);
		}

		// Pick a random image from search
		const image = imagesFiltered[Math.floor(Math.random() * imagesFiltered.length)];

		embed.setDescription(image.name)
		embed.setImage(image.url);
		return await channel.send(embed);

	}

}
