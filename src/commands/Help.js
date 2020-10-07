module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("help", ...arguments);
		this.register("Shows this message 😎.", HelpSection.GENERAL, [{
			argument: "Help section",
			required: false,
		}]);
	}

	async onCommand({ root, args, sender, channel, guildConfig }) {

		const list = [];
		const { prefix } = guildConfig;
		const categorys = {
			[HelpSection.GENERAL]: "General",
			[HelpSection.MISCELLANEOUS]: "Miscellaneous",
			[HelpSection.MODERATION]: "Moderation",
			[HelpSection.MUSIC]: "Music",
		}

		if(args.length === 0) {

			list.push(`Heres a list of command sections. For more info, do \`${root} [section]\`\n `);

			Object.keys(categorys).map(category => {
				list.push(`**${categorys[category]} Commands**`);
				list.push(`\`${root} ${categorys[category].toLowerCase()}\``);
				list.push(`\n`);
			})

		}

		if(args.length === 1) {

			let cat;
			for(const category in categorys) if(categorys[category].toLowerCase().includes(args[0].toLowerCase())) cat = category;

			list.push(`**${categorys[cat]}** Commands:\n `);

			global.help.map(({ aliases, category, description, args }) => {
				if(category !== cat) return;

				list.push(`**\`${prefix}${aliases[0]}\`**:`);
				list.push(`${description}`);
				list.push(`Usage: \`${prefix}${aliases[0]}${args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``);
				aliases.length > 1 && list.push(`Aliases: \`${prefix}${aliases.splice(1).join(`\`, \`${prefix}`)}\``);
				list.push(`\n`);
			})

		}

		const embed = new MessageEmbed();
		embed.setColor(guildConfig.theme.info);
		embed.setTitle(`Josh O' Bot's Help Menu`)
		embed.setDescription(`${list.join("\n").replace(/\n\n/gm, "\n")}\n[Configure Online](https://josho.bot.nu) • [Support Server](https://discord.gg/5ha2Zk)`);
		return channel.send(embed);

	}

}
