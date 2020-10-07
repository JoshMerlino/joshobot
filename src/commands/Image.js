module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("image", ...arguments);
		this.register("Google image search. 🖼", HelpSection.GENERAL, [{
			argument: "Search query",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const term = args.join(" ");

		request({
		    method: "GET",
		    url: "https://bing-image-search1.p.rapidapi.com/images/search",
		    qs: { q: term },
		    headers: {
		        "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
		        "x-rapidapi-key": process.env.RAPID_API_KEY,
		        useQueryString: true
		    }
		}, function(error, response, body) {

			const embed = new MessageEmbed();
			embed.setTitle(term);

			if (!error) {

				const { value: images } = JSON.parse(body);
				const image = images[Math.floor(Math.random() * images.length)];
				embed.setColor(`#${image.accentColor}`);
				embed.setImage(image.contentUrl);
				embed.setFooter(sender.displayName, sender.user.displayAvatarURL())

			}

			channel.send(embed);

		})


	}

}
