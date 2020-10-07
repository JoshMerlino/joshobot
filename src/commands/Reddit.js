const isImageUrl = require('is-image-url');
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

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit, message }) {

		const subreddit = args[0].toLowerCase();

		let allowed

        try {
            const res = await fetch("https://www.reddit.com/r/" + args[0] + ".json?limit=100").then(a => a.json())
            allowed = res.data.children.filter(post => !post.data.is_self)
        } catch (e) {
            return channel.send("Invalid subreddit")
        }

        const chosen = allowed[Math.floor(Math.random() * allowed.length)]

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		const a = await redditImage(chosen, allowed)
        const image = a.split("|")[0];
        const title = a.split("|")[1];
        let url = a.split("|")[2];
        const author = a.split("|")[3];
		url = "https://reddit.com" + url

		embed.setTitle(title);
		embed.setAuthor("u/" + author + " | r/" + subreddit)
		image !== "lol" && embed.setImage(image);
		embed.setURL(url)

		if(chosen.over_18 && message.channel.nsfw) {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`This is NSFW content and \`#${channel.displayName}\` is not an NSFW channel.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		} else {
			channel.send(embed);
		}


	}

}
