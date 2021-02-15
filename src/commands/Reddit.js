module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"reddit"
		], ...arguments);
		this.register(
			"Gets a random picture off of Reddit. 🖼",
			HelpSection.FUN,
			[{
				argument: "Subreddit",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel, guildConfig }) {

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setTitle("Reddit");

		// Makesure subreddit is specified
		if(args.length < 1) return await this.sendUsage(channel);

		// Get args
		const [ subreddit ] = args;

		// Show typing while making external API request
		channel.startTyping();

		// Initialize allowed posts
		let allowed;

		// Attempt to fetch allowed post
        try {
            const res = await fetch(`https://www.reddit.com/r/${subreddit}.json?limit=100`).then(a => a.json())
            allowed = res.data.children.filter(post => !post.data.is_self)
        } catch (e) {
			embed.setColor(Color.error);
			embed.setDescription(`r/${subreddit} is not a valid subreddit!`);
            return await channel.send(embed);
        } finally {
			channel.stopTyping();
		}

        const chosen = allowed[Math.floor(Math.random() * allowed.length)];
		const { data } = chosen;

		// Get image
		const [ image,, rpath ] = await util.redditImage(chosen, allowed);
		const url = `https://reddit.com${rpath}`;

		// Get author info
		const author = await fetch(`https://www.reddit.com/user/${data.author}/about.json`).then(resp => resp.json());

		// Ensure NSFW only is posted in NSFW channels
		if(data.over_18 && !channel.nsfw) {
			embed.setColor(Color.error);
			embed.setDescription(`This subreddit contains NSFW content.\nTo make this an NSFW channel do \`${guildConfig.prefix}ch nsfw\``);
		} else {
			embed.setAuthor(`u/${data.author} • r/${data.subreddit}`, author.data.icon_img.split("?")[0]);
			embed.setDescription(data.title);
			embed.setImage(image);
			embed.setURL(url);
		}

		// Send embed
		return await channel.send(embed);

	}

}
