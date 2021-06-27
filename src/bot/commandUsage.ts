import Color from "./class/Color";
import { Message, MessageEmbed } from "discord.js";

export default function commandUsage(message: Message, { config, alias, args = [] }: RunnableCommand): MessageEmbed {

	const { prefix } = config.value;

	const embed = new MessageEmbed;
	embed.setColor(Color.RED);
	embed.setFooter(`${config.value.prefix}${alias.toLowerCase()} • ${message.author.tag}`, message.author.avatarURL()!);
	embed.setTitle("Incorrect usage");
	embed.setDescription(`**Usage**: \`${prefix}${alias}${args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``);
	embed.setTimestamp();
	return embed;

}
