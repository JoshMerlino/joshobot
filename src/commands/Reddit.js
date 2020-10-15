const isImageUrl = require("is-image-url");
const redditImage = async function(post, allowed)  {
	let image = post.data.url

	if (image.includes("imgur.com/a/")) {
		post = allowed[Math.floor(Math.random() * allowed.length)]
		image = post.data.url
	}

	if (image.includes("imgur") && !image.includes("gif")) {
		image = "https://i.imgur.com/" + image.split("/")[3]
		if (!isImageUrl(image)) {
			image = "https://i.imgur.com/" + image.split("/")[3] + ".gif"
		}
		return image + "|" + post.data.title + "|" + post.data.permalink + "|" + post.data.author
	}

	if (image.includes("gfycat")) {

		const link = await fetch("https://api.gfycat.com/v1/gfycats/" + image.split("/")[3]).then(url => url.json())

		if (link.gfyItem) {
			image = link.gfyItem.max5mbGif
			return image + "|" + post.data.title + "|" + post.data.permalink + "|" + post.data.author
		}
	}

	let count = 0

	while (!isImageUrl(image)) {

		if (count >= 10) {
			console.log("couldnt find image @ " + post.data.subreddit_name_prefixed)
			return "lol"
		}

		count++

		post = allowed[Math.floor(Math.random() * allowed.length)]
		image = post.data.url

		if (image.includes("imgur.com/a/")) {
			post = allowed[Math.floor(Math.random() * allowed.length)]
			image = post.data.url
		}

		if (image.includes("imgur") && !image.includes("gif") && !image.includes("png")) {
			image = "https://i.imgur.com/" + image.split("/")[3]
			image = "https://i.imgur.com/" + image.split("/")[3] + ".png"
			if (!isImageUrl(image)) {
				image = "https://i.imgur.com/" + image.split("/")[3] + ".gif"
				return image + "|" + post.data.title + "|" + post.data.permalink + "|" + post.data.author
			}
		}

		if (image.includes("gfycat")) {

			const link = await fetch("https://api.gfycat.com/v1/gfycats/" + image.split("/")[3]).then(url => url.json())

			if (link) {
				image = link.gfyItem.max5mbGif
				return image + "|" + post.data.title + "|" + post.data.permalink + "|" + post.data.author
			}
		}
	}
	return image + "|" + post.data.title + "|" + post.data.permalink + "|" + post.data.author
}

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("reddit", ...arguments);
		this.register("Gets a random picture off of Reddit. 🖼", HelpSection.GENERAL, [{
			argument: "Subreddit",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel }) {

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// Makesure subreddit is specified
		if(args.length !== 1) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		// Show typing while making external API request
		channel.startTyping();

		let allowed;

        try {
            const res = await fetch(`https://www.reddit.com/r/${args[0]}.json?limit=100`).then(a => a.json())
            allowed = res.data.children.filter(post => !post.data.is_self)
        } catch (e) {
			embed.setColor(guildConfig.theme.error);
			embed.addField("Error", "Invalid subreddit", true);
			embed.addField("Description", this.description, true);
			embed.addField("Usage", this.usage, true);
            return await channel.send(embed);
        }

        const chosen = allowed[Math.floor(Math.random() * allowed.length)];
		const { data } = chosen;

		const a = await redditImage(chosen, allowed)
        const image = a.split("|")[0];
		const url = `https://reddit.com${a.split("|")[2]}`;

		embed.setAuthor(`u/${data.author} • r/${data.subreddit}`, (await fetch(`https://www.reddit.com/user/${data.author}/about.json`).then(resp => resp.json())).data.icon_img.split("?")[0])
		embed.setTitle(data.title);
		embed.setColor(data.link_flair_background_color === "" ? guildConfig.theme.info : data.link_flair_background_color)

		channel.stopTyping();

		if(data.over_18 && channel.nsfw) {
			embed.setColor(guildConfig.theme.error)
			embed.addField("Error", `This subreddit contains NSFW content. Run this command again in an NSFW channel.`, true)
			return await channel.send(embed);
		}

		embed.setImage(image);
		embed.setURL(url);

		return await channel.send(embed);

	}

}
