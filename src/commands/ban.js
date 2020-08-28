const { MessageEmbed } = require("discord.js");

// Define which config section this command uses
const command = "ban";

module.exports = function Command(client, config) {
	client.on("message", async message => {

		// Destructure data from message object
		const { content, channel, member } = message;
		const [ root, ...args ] = content.split(" ");

		if (root.toLowerCase() === (config.prefix + config.commands[command].command).toLowerCase() && config.commands[command].enabled) {

			// If no arguments were specified
			if (args.length === 0) {
				const embed = new MessageEmbed()
				.setColor(config.theme.warn)
				.setDescription(`Incorrect usage!\n\`${config.prefix}${config.commands[command].command} <@user>\``)
				return channel.send(embed);
			}

		}

	});
}
