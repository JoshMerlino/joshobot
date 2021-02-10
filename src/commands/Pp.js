const [ ppbottom, ppmiddle, pphead  ] = [ "<:ppbottom:762165942942826517>", "<:ppmiddle:762165978808975371>", "<:pphead:762165903114240031>" ];

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"pp"
		], ...arguments);
		this.register(
			"Estimates a server members PP size. 😏",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "@User",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, channel, guild }) {

		const user = guild.member(args.length > 0 ? args[0].replace(/[\\<>@#&!]/g, "") : sender.id);
		const size = Math.max(3, parseInt(user.user.id.substr(2, 2)) * 0.18 % 10);

		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
		embed.setTitle(`${user.displayName}'s PP Size`);
		embed.setDescription(`Estimated Size: **${Math.floor(size*10)/10}in**\n${ppbottom}${ new Array(Math.max(Math.floor(size - 2), 0)).fill(ppmiddle).join("") }${pphead}`);
		channel.send(embed);

	}

}
