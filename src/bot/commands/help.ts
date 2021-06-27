/* eslint no-extra-parens: off */
import asyncRequireContext from "async-require-context";
import { Message } from "discord.js";
import { resolve } from "path";
import HelpSections from "../class/HelpSections";
import embedTemplate from "../embedTemplate";

export const category = HelpSections.GENERAL;
export const description = "Shows this message 😎.";
export const args = [ { argument: "Help section", required: false } ];
export const alias = [ "help", "h" ];

export async function handler(message: Message, command: RunnableCommand): Promise<unknown> {

	const { channel } = message;
	const embed = embedTemplate(message, command);
	embed.setTitle("Help • Josh O' Bot");

	// Get arguments
	const [ root, ...args ] = message.content.split(" ");

	// Initialize help list
	const list: string[] = [];

	// Get prefix from config
	const prefix = <string>command.config.value.prefix;

	// If help section is specified
	if (args.length === 1) {

		// Get contexts
		const commands = await asyncRequireContext<Command>(resolve("./lib/bot/commands"));

		// Get requested help section
		const section = Object.keys(HelpSections).filter(key => key.toLowerCase().includes(args[0].toLowerCase()))[0];

		// If a specific section is specified
		if (section !== undefined) {

			// Get commands
			commands.map(context => {

				const { description = "", alias, category = "MISCELLANEOUS", args = [] } = context.module;
				const aliases = typeof alias === "object" ? alias : [ alias ];

				// If command isnt in that category
				if (category.toString().toUpperCase() !== section) return;

				// Push command to help
				list.push(`\`${prefix}${aliases[0]}\` • **${description}**`);
				list.push(`**Usage**: \`${prefix}${aliases[0]}${args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``);
				if (aliases.length > 1) list.push(`**Aliases**: \`${prefix}${aliases.splice(1).join(`\`, \`${prefix}`)}\``);
				list.push("\n");

			});

			// Formulate embed
			embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
			return channel.send(embed);

		}

	}

	// Show default help page
	list.push(`Heres a list of command sections. For more info, do \`${root} [section]\`\n `);

	// Push each command module to list
	Object.keys(HelpSections).map(category => {
		list.push(`**${(<Record<string, string>><unknown>HelpSections)[category].toString()} Commands**`);
		list.push(`\`${root} ${category.toString().toLowerCase()}\``);
		list.push("\n");
	});

	// Push footer to description
	list.push("[Support Server](https://discord.gg/5ha2Zk) • [Get Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot)");

	embed.setDescription(list.join("\n").replace(/\n\n/gm, "\n"));
	return channel.send(embed);

}
