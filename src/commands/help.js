const { MessageEmbed } = require("discord.js");

// Define which config section this command uses
const command = "help";

module.exports = function Command(client, config) {
	client.on("message", async message => {

		// Destructure data from message object
		const { content, channel, member } = message;
		const [ root, ...args ] = content.split(" ");

		if (root.toLowerCase() === (config.prefix + config.commands[command].command).toLowerCase() && config.commands[command].enabled) {

			// If no arguments were specified
			if (args.length === 0) {
				const embed = new MessageEmbed()
				.setColor(config.theme.primary)
				.setFooter(`Created by JoshM#1000 & Jeremy#2000 - JoshMerlino/josh-o-bot`)
				.addField("Moderator commands", `\`${config.prefix}${config.commands[command].command} moderator\``, true)
				return channel.send(embed);
			}

			if(args[0].toLowerCase() === "moderator") {
				const embed = new MessageEmbed()
				.setColor(config.theme.primary)
				config.commands["ban"].enabled && embed.addField("Ban user", `\`${config.prefix}${config.commands["ban"].command} <@user>\``, true)
				return channel.send(embed);
			}

			// If the sub command dosnt exist
			return channel.send(new MessageEmbed()
				.setColor(config.theme.warn)
				.setDescription(`Unknown help chapter **${args.join(" ")}**.\nUse \`${config.prefix}${config.commands[command].command}\` for a list of commands.`)
			);

		}

	});
}
