module.exports = class Command extends require("../Command.js") {

	answers = [
		"as i see it, yes",
	    "Ask again later",
	    "Better not tell you now",
	    "Cannot predict now",
	    "Concentrate and ask again",
	    "Don’t count on it",
	    "It is certain",
	    "It is decidedly so",
	    "Most likely",
	    "My reply is no",
	    "My sources say no",
	    "Outlook not so good",
	    "Outlook promising",
	    "Reply hazy, try again",
	    "Signs point to yes",
	    "Very doubtful",
	    "Without a doubt",
	    "Yes",
	    "Yes – definitely",
	    "You may rely on it",
	    "<a:eatmyass:751566082451439627>"
	]

	constructor() {
		super("8ball", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const embed = new MessageEmbed();
		embed.setTitle("8 Ball")

		if (args.length === 0) {
			embed.setColor(guildConfig.theme.error);
			embed.setDescription(`You must ask the 8 ball something.\nUsage: \`${root} <question ...>\``)
			embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
            return channel.send(embed);
        }

		const question = args.join(" ");
		embed.setColor(guildConfig.theme.info);
		embed.setDescription("**" + question + "**: _" + this.answers[Math.floor(Math.random() * this.answers.length)] + "_");
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		await channel.send(embed);

	}

}
