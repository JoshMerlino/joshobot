const [ ppbottom, ppmiddle, pphead  ] = [ "<:ppbottom:762165942942826517>", "<:ppmiddle:762165978808975371>", "<:pphead:762165903114240031>" ];

module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("pp", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const user = guild.member(args.length > 0 ? args[0].replace(/[\\<>@#&!]/g, "") : sender.id);

		const id = parseInt(user.user.id.substr(2, 6));
		const size = id * .0000135;

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());
		embed.setTitle(`${user.displayName}'s PP Size`);
		embed.setDescription(`Estimated Size: **${Math.floor(size*10)/10}in**\n${ppbottom}${ new Array(Math.floor(size - 2)).fill(ppmiddle).join("") }${pphead}`);
		channel.send(embed);

	}

}
