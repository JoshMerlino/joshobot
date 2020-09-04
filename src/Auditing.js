module.exports = async function(client, guild) {

	const audit = guild.channels.cache.get(config[guild.id].audit.channel);
	Object.keys(config[guild.id].audit.events).map(eventType => {
		const eventConfig = config[guild.id].audit.events[eventType];
		if (eventConfig.enabled) {
			client.on(eventType, async function(event) {

				const message = new MessageEmbed()
				.setColor(config[guild.id].theme[eventConfig.color.toLowerCase()])
				.setTitle(eventConfig.title)
				.setFooter(`ID: ${event.id}`)
				.setTimestamp()

				// Event specific auditing stuff here

				if(eventType === "channelCreate") {
					message.setDescription(`Channel <#${event.id}>`);
					message.addField("Channel Properties", `
						NSFW: ${event.nsfw ? "yes":"no"}
						Private: ${Array.from(event.permissionOverwrites).length > 0 ? "yes":"no"}
					`, true);
				}

				console.log(event);
				audit.send(message);

			});
		}
	});

}
