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
					message.setDescription(`Channel: <#${event.id}> (#${event.name})`);
					message.addField("Channel Properties", `NSFW: ${event.nsfw ? "yes":"no"}\nPrivate: ${Array.from(event.permissionOverwrites).length > 0 ? "yes":"no"}\nSlow Mode: ${event.rateLimitPerUser ? event.rateLimitPerUser : "none"}`, true);
				}

				if(eventType === "channelDelete") {
					message.setDescription(`Channel: #${event.name}`);
					message.addField("Channel Properties", `NSFW: ${event.nsfw ? "yes":"no"}\nPrivate: ${Array.from(event.permissionOverwrites).length > 0 ? "yes":"no"}\nSlow Mode: ${event.rateLimitPerUser ? event.rateLimitPerUser : "none"}`, true);
				}

				console.log(event);
				audit.send(message);

			});
		}
	});

}
