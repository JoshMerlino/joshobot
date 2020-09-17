module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("image", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const term = args.join(" ");

		request({
		    method: "GET",
		    url: "https://bing-image-search1.p.rapidapi.com/images/search",
		    qs: {
		        offset: "1",
		        count: "1",
		        q: term
		    },
		    headers: {
		        "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
		        "x-rapidapi-key": process.env.RAPID_API_KEY,
		        useQueryString: true
		    }
		}, function(error, response, body) {

			const embed = new MessageEmbed();
			embed.setTitle(list[0].word);

			if (!error) {

				const { value: images } = JSON.parse(body);
				embed.setColor(`#${images[0].accentColor}`);
				embed.setImage(images[0].contentUrl)

			}

			channel.send(embed);

		})


	}

}
