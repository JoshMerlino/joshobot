module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("urban", ...arguments);
		this.register("Look up a term from Urban Dictionary. 📘", HelpSection.GENERAL, [{
			argument: "Term",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const term = args.join(" ");

		request({
		    method: "GET",
		    url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
		    qs: { term },
		    headers: {
		        "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
		        "x-rapidapi-key": process.env.RAPID_API_KEY,
		        useQueryString: true
		    }
		}, function(error, response, body) {
		    if (error) {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.error)
				.setDescription(`No definitions found for **\`${term}\`**.`));
			}

		    const { list } = JSON.parse(body);

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

				let definitions = [];
				list.splice(0,3).map(({ definition }) => definitions.push(definition));
				embed.setDescription(definitions.join("\n\n").replace(/\[|\]/g, "_"));
				embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

				if (!error) {

					const { value: images } = JSON.parse(body);
					embed.setColor(`#${images[0].accentColor}`);
					embed.setThumbnail(images[0].contentUrl)

				}

				channel.send(embed);

			})

		});

	}

}
