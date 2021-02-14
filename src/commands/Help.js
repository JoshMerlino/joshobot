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

		// If help section is specified
		if(args.length === 1) {

			// Get requested help section
			const section = Object.keys(HelpSection).filter(key => key.toLowerCase().includes(args[0].toLowerCase()));

			// If a specific section is specified
			if(section.length === 1) {

				// Get section
				const [ sec ] = section;

				// Get commands
				global.help.map(({ aliases, category, description, args }) => {

					// If command isnt in that category
					if(category.toString().toUpperCase() !== sec) return;

					// Push command to help
					list.push(`\`${prefix}${aliases[0]}\` • **${description}**`);
					list.push(`**Usage**: \`${prefix}${aliases[0]}${args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``);
					aliases.length > 1 && list.push(`**Aliases**: \`${prefix}${aliases.splice(1).join(`\`, \`${prefix}`)}\``);
					list.push(`\n`);

				});

				// Formulate embed
				const embed = new MessageEmbed();
				embed.setColor(Color.info);
				embed.setTitle(`Help • Josh O' Bot`)
				embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
				return channel.send(embed);

			}

		}

		// Show default help page
		list.push(`Heres a list of command sections. For more info, do \`${root} [section]\`\n `);

		// Push each command module to list
		Object.keys(HelpSection).map(category => {
			list.push(`**${HelpSection[category].toString()} Commands**`);
			list.push(`\`${root} ${HelpSection[category].toString().toLowerCase()}\``);
			list.push(`\n`);
		})

		// Push footer to description
		list.push(`[Support Server](https://discord.gg/5ha2Zk) • [Get Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot)`);

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setColor(Color.info);
		embed.setTitle(`Help • Josh O' Bot`)
		embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
		return channel.send(embed);

	}

}
