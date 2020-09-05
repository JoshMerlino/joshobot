module.exports = async function(client, guild) {

	const audit = guild.channels.cache.get(config[guild.id].audit.channel);
	Object.keys(config[guild.id].audit.events).map(eventType => {
		const eventConfig = config[guild.id].audit.events[eventType];
		if (eventConfig.enabled) {
			client.on(eventType, async function() {

				const event = arguments[1] || arguments[0];

				const message = new MessageEmbed()
				.setColor(config[guild.id].theme[eventConfig.color.toLowerCase()])
				.setTitle(eventConfig.title)
				.setFooter(`ID: ${event.id}`)
				.setTimestamp()

				// Event specific auditing stuff here

				if(eventType === "channelCreate" || eventType === "channelDelete" || eventType === "channelUpdate") {
					message.setDescription(`Channel: \`#${event.name}\` (<#${event.id}>)\nNSFW: ${event.nsfw ? "`yes`":"`no`"}\nPrivate: ${Array.from(event.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\nSlow Mode: \`${event.rateLimitPerUser ? event.rateLimitPerUser : "none"}\`\nTopic: \`${event.topic ? event.topic : "none"}\``, true);
				}

				if(eventType === "guildMemberAdd" || eventType === "guildMemberRemove" || eventType === "guildMemberUpdate") {
					const roles = Array.from(event.guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[event.id]._roles
					message.setDescription(`Member: ${event.user.toString()}\nUsername: \`${event.user.username}\`\nDiscriminator : \`#${event.user.discriminator}\`\nNickname: \`${event.nickname ? event.nickname : "none"}\`\nHuman: \`${event.user.bot ? "no":"yes"}\`\nMember For: \`${dayjs().from(event.joinedTimestamp, true)}\`\nRoles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`, true);
					message.setThumbnail(event.user.displayAvatarURL());
				}

				// console.log(event);
				audit.send(message);

			});
		}
	});

}
