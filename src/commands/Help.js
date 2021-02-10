module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"help",
			"h"
		], ...arguments);
		this.register(
			"Shows this message 😎.",
			HelpSection.GENERAL,
			[{
				argument: "Help section",
				required: false,
			}]
		);
	}

	async onCommand({ root, args, channel, guildConfig }) {

		// Initialize help list
		const list = [];

		// Get prefix from config
		const { prefix } = guildConfig;

		// Convert enum properties to human readable strings
		const categorys = {
			[HelpSection.GENERAL]: "General",
			[HelpSection.MISCELLANEOUS]: "Miscellaneous",
			[HelpSection.MODERATION]: "Moderation",
		}

		// Show default help page if no args
		if(args.length === 0) {

			// Push header to list
			list.push(`Heres a list of command sections. For more info, do \`${root} [section]\`\n `);

			// Push each command module to list
			Object.keys(categorys).map(category => {
				list.push(`**${categorys[category]} Commands**`);
				list.push(`\`${root} ${categorys[category].toLowerCase()}\``);
				list.push(`\n`);
			})

		}

		// If there are args
		if(args.length === 1) {

			// Filter category and get requested help category
			let cat;
			for(const category in categorys) if(categorys[category].toLowerCase().includes(args[0].toLowerCase())) cat = category;

			// Push description header
			list.push(`**${categorys[cat]}** Commands:\n `);

			// Get commands in that category
			global.help.map(({ aliases, category, description, args }) => {
				if(category !== cat) return;

				// Push command to help
				list.push(`**\`${prefix}${aliases[0]}\`**:`);
				list.push(`${description}`);
				list.push(`Usage: \`${prefix}${aliases[0]}${args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``);
				aliases.length > 1 && list.push(`Aliases: \`${prefix}${aliases.splice(1).join(`\`, \`${prefix}`)}\``);
				list.push(`\n`);

			});

		}

		// Push footer to description
		list.push(`[Configure Online](https://josho.bot.nu) • [Support Server](https://discord.gg/5ha2Zk) • [Get Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot)`);

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setTitle(`Josh O' Bot - Help`)
		embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
		return channel.send(embed);

	}

}
