const { MessageEmbed } = require("discord.js");

module.exports = function Command(client, config) {
	client.on("message", async message => {

		// Destructure data from message object
		const { content, channel, member } = message;

		if(content.startsWith(config.prefix + "help") && config.commands.help.enabled) {

			// Send embed
			channel.send(new MessageEmbed()
          	.setColor("#00C853")
          	.setDescription(`HELP`));

		}

	});
}
