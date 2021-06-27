import { Message } from "discord.js";
import NestedKeys from "nested-keys";
import HelpSections from "../class/HelpSections";
import embedTemplate from "../embedTemplate";
import * as Diff from "diff";

export const category = HelpSections.MODERATION;
export const permission = "ADMINISTRATOR";
export const description = "Reads or updates the guild configuration ⚙.";
export const args = [ { argument: "Key", required: false }, { argument: "Value", required: false } ];
export const alias = [ "config", "cfg", "configuration" ];

export async function handler(message: Message, command: RunnableCommand): Promise<unknown> {

	const { channel } = message;
	const embed = embedTemplate(message, command);
	embed.setTitle("Configuration");

	// Get arguments
	const [ , key, sourceVal = null, ...rest ] = message.content.split(" ");

	// Make sure a key is specified
	if (key === undefined) {
		embed.setDescription(`Showing the full configuration for **${message.guild?.name}**\n\n\`\`\`json\n${JSON.stringify(command.config.value, null, 4)}\n\`\`\``);
		return await channel.send(embed);
	}

	// If get mode
	if (sourceVal === null) {
		embed.setDescription(`\`${key}\` = \`${JSON.stringify(command.config.value[key])}\``);
		return await channel.send(embed);
	}

	const type = (v: string) => JSON.parse(`{ "_": ${v} }`)._;
	let val;

	try {
		val = type([ sourceVal, ...rest ].join(" "));
	} catch (e) {
		val = [ sourceVal, ...rest ].join(" ");
	}

	const beforeConfig = command.config.value;
	const afterConfig = { ...beforeConfig };
	NestedKeys.set(afterConfig, key.split("."), val);

	const lines = Diff.diffLines(JSON.stringify(beforeConfig, null, 4), JSON.stringify(afterConfig, null, 4));

	const diff = lines
		.map(line => {
			console.log(line);
			return line;
		})
		.flatMap(part => {
			const color = part.added ? "+" :part.removed ? "-" : " ";
			return (color + part.value.split("\n").join(`\n${color}`)).split("\n");
		})
		.filter(line => ![ "-", "+", " " ].includes(line));

	command.config.value = afterConfig;

	// Send embed
	embed.setDescription(`Showing the updated configuration for **${message.guild?.name}**\n\n\`\`\`diff\n${diff.join("\n")}\n\`\`\``);
	return await channel.send(embed);

}
