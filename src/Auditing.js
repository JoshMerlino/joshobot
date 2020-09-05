module.exports = async function(client, guild) {

	Object.keys(config[guild.id].audit.events).map(eventType => {
		client.on(eventType, async function() {
			if (eventConfig.enabled) {

				const eventConfig = config[guild.id].audit.events[eventType];
				const audit = guild.channels.cache.get(config[guild.id].audit.channel);

				const event = arguments[1] || arguments[0];

				if(event.guild.id !== guild.id) return;

				const message = new MessageEmbed()
				.setColor(config[guild.id].theme[eventConfig.color.toLowerCase()])
				.setTitle(eventConfig.title)
				.setFooter(`ID: ${event.id}`)
				.setTimestamp()

				// Event specific auditing stuff here

				if(eventType === "channelCreate" || eventType === "channelDelete" || eventType === "channelUpdate") {
					message.setDescription(`Channel: \`#${event.name}\` (<#${event.id}>)\nNSFW: ${event.nsfw ? "`yes`":"`no`"}\nPrivate: ${Array.from(event.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\nSlow Mode: \`${event.rateLimitPerUser ? event.rateLimitPerUser : "none"}\`\nTopic: \`${event.topic ? event.topic : "none"}\``);
				}

				if(eventType === "guildMemberAdd" || eventType === "guildMemberRemove" || eventType === "guildMemberUpdate") {
					const roles = Array.from(event.guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[event.id]._roles
					message.setDescription(`Member: ${event.user.toString()}\nUsername: \`${event.user.username}\`\nDiscriminator : \`#${event.user.discriminator}\`\nNickname: \`${event.nickname ? event.nickname : "none"}\`\nHuman: \`${event.user.bot ? "no":"yes"}\`\nMember For: \`${dayjs().from(event.joinedTimestamp, true)}\`\nRoles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`);
					message.setThumbnail(event.user.displayAvatarURL());
				}

				if(eventType === "inviteCreate" || eventType === "inviteDelete") {
					message.setDescription(`User: <@!${event.inviter}>\nChannel: \`#${event.channel.name}\` (<#${event.channel.id}>)\nInvite Code: \`${event.code}\`\nExpires: \`${event.maxAge === 0 ? "never" : dayjs().from(event.maxAge, true)}\``);
				}

				// console.log(event);
				audit.send(message);

			}
		});
	});

}
