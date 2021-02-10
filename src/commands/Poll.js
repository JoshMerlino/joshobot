module.exports = class Command extends require("../Command.js") {

	constructor() {
		super(["poll"], ...arguments);
		this.register("Creates a poll. ❎", HelpSection.MISCELLANEOUS, [{
			argument: "Poll",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel }) {

		const msg = args.join(" ");

		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setAuthor(sender.displayName, sender.user.displayAvatarURL());
		embed.setTitle(`${sender.displayName} Created a Poll`);
		embed.addField("Poll", msg);

		channel.send(embed).then(async m => {
            await m.react("✅");
            await m.react("❌");
        });

	}

}
