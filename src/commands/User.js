module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"user",
			"whois",
			"who"
		], ...arguments);
		this.register(
			"Gets basic information about a Discord account. ℹ",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "@User",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, channel, guild }) {

		// Get user
		const user = await util.user(args[0] || sender, guild);

		// Get status emoji
		const statusEmoji = Object.values(util.parseCollection(util.parseCollection(client.guilds.cache)["635938104775278602"].emojis.cache)).filter(emoji => emoji.name === user.presence.status).toString();

		// Get presences
		const presence = [];
		for (const activity of user.presence.activities) presence.push(activity.state || activity);

		// Get roles
		const roles = Object.values(util.parseCollection(user.roles.cache)).filter(role => role.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition);

		// Initialize table
		const [ leftCol, rightCol ] = [[
			`• ID: \`${user.user.id}\``,
			`• Account created on: **${util.ts(user.user.createdAt)}**`,
			`\n[Jump to last message](https://discord.com/channels/${guild.id}/${user.lastMessageChannelID}/${user.lastMessageID})`
		], [
			`• Role${roles.length !== 1 ? `s (${roles.length})`:""}: ${roles.length === 0 ? "***none***" : roles.map(role => role.toString()).join(", ")}`,
			`• Joined on: **${util.ts(user.joinedAt)}**`,
			`• Display color: \`${user.displayHexColor.toUpperCase()}\``,
			`• Booster since: ${user.premiumSince === null ? "***not boosting***" : util.ts(user.premiumSince)}`
		]];

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();
		embed.setColor(Color.info);
		embed.setTitle("User");
		embed.addField("User Info", leftCol.join("\n"), true);
		embed.addField("\u200b", rightCol.join("\n"), true);
		embed.setThumbnail(user.user.displayAvatarURL());
		embed.setDescription(`${statusEmoji} **${user.user.tag}**${user.nickname === null ? "":` *aka* **${user.nickname}**`}${presence.length === 0 ? "":" • "}${presence.join(" • ")}`);

		// Send embed
		return await channel.send(embed);

	}

}
