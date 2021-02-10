module.exports = class Command extends require("../Command.js") {

	constructor() {
		super(["8ball"], ...arguments);
		this.register("Predicts the future. 🎱", HelpSection.MISCELLANEOUS, [{
			argument: "Question",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel }) {

		const embed = new MessageEmbed();
		embed.setTitle("8 Ball")
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		if (args.length === 0) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return channel.send(embed);
        }

		const question = args.join(" ");
		const answer = Texts.PROBABILITYS[Math.floor(Math.random() * Texts.PROBABILITYS.length)] + ".";
		embed.setColor(Color.info);
		embed.addField("Question", question, true)
		embed.addField("Answer", answer, true)

		await channel.send(embed);

	}

}
