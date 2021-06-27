import Color from "./class/Color";
import { Message, MessageEmbed } from "discord.js";

export default function embedTemplate(message: Message, { config, alias }: RunnableCommand): MessageEmbed {

	const embed = new MessageEmbed;
	embed.setColor(Color.BLURPLE);
	embed.setFooter(`${config.value.prefix}${alias.toLowerCase()} • ${message.author.tag}`, message.author.avatarURL()!);
	embed.setTimestamp();
	return embed;

}
