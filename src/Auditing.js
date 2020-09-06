module.exports = async function(client, guild) {

	Object.keys(config[guild.id].audit.events).map(eventType => {
		client.on(eventType, async function(event, newEvent) {
			const eventConfig = config[guild.id].audit.events[eventType];
			if (eventConfig.enabled) {

				const audit = guild.channels.cache.get(config[guild.id].audit.channel);

				if(event.guild.id !== guild.id) return;

				const message = new MessageEmbed()
				.setColor(config[guild.id].theme[eventConfig.color.toLowerCase()])
				.setTitle(eventConfig.title)
				.setFooter(`ID: ${event.id || event.user.id || event.channel.id}`)
				.setTimestamp()
				let lines = [];

				// Event specific auditing stuff here

				if(eventType === "channelCreate" || eventType === "channelDelete") {
					lines.push(`Channel: \`#${event.name}\` (<#${event.id}>)`);
					lines.push(`NSFW: \`${event.nsfw ? "`yes`":"`no`"}\``);
					lines.push(`Private Channel: \`${Array.from(event.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\``);
					lines.push(`Topic: \`${event.topic}\``);
				}

				if(eventType === "channelUpdate") {
					if(event.name !== newEvent.name) 										lines.push(`**Channel: \`#${newEvent.name}\` (<#${newEvent.id}>) Was: #${event.name}**`)
					else 																lines.push(`Channel: \`#${newEvent.name}\` (<#${newEvent.id}>)`);
					if(event.nsfw !== newEvent.nsfw) 										lines.push(`**NSFW: \`${newEvent.nsfw ? "`yes`":"`no`"}\` Was: ${event.nsfw ? "`yes`":"`no`"}**`)
					else 																lines.push(`NSFW: \`${newEvent.nsfw ? "`yes`":"`no`"}\``);
					if(newEvent.permissionOverwrites.equals(event.permissionOverwrites)) 	lines.push(`**Private Channel: \`${Array.from(newEvent.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\` Was: ${Array.from(event.permissionOverwrites).length > 0 ? "`yes`":"`no`"}**`)
					else 																lines.push(`Private Channel: \`${Array.from(newEvent.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\``);
					if(event.topic !== newEvent.topic) 										lines.push(`**Topic: \`${newEvent.topic || "*none*"}\` Was: \`${event.topic || "*none*"}\`**`)
					else 																lines.push(`Topic: \`${newEvent.topic || "*none*"}\``);
				}

				if(eventType === "guildMemberAdd" || eventType === "guildMemberRemove") {
					const roles = Array.from(event.guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[event.id]._roles
					message.setThumbnail(event.user.displayAvatarURL());
					lines.push(`Member: ${event.user.toString()}`)
					lines.push(`Username: \`${event.user.username}\``);
					lines.push(`Discriminator : \`#${event.user.discriminator}\``);
					lines.push(`Nickname: \`${event.nickname ? event.nickname : "none"}\``);
					lines.push(`Human: \`${event.user.bot ? "no":"yes"}\``);
					lines.push(`Member For: \`${dayjs().from(event.joinedTimestamp, true)}\``);
					lines.push(`Roles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`);
				}

				if(eventType === "guildMemberUpdate") {
					const roles = Array.from(event.guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[event.id]._roles
					const newRoles = Array.from(newEvent.guild.members.cache).reduce((obj, [key, value]) => (Object.assign(obj, { [key]: value })), {})[newEvent.id]._roles
					message.setThumbnail(event.user.displayAvatarURL());
					if(event.user.id !== newEvent.user.id)                                  lines.push(`**Member: ${newEvent.user.toString()} Was: ${event.user.toString()}**`);
					else                                                                lines.push(`Member: ${event.user.toString()}`);
					if(event.user.username !== newEvent.user.username)                      lines.push(`**Username: \`${newEvent.user.username}\` Was: \`${event.user.username}\`**`);
					else                                                                lines.push(`Username: \`${event.user.username}\``);
					if(event.user.discriminator !== newEvent.user.discriminator)            lines.push(`**Discriminator : \`#${newEvent.user.discriminator}\` Was: \`#${event.user.discriminator}\`**`);
					else                                                                lines.push(`Discriminator : \`#${event.user.discriminator}\``);
					if(event.nickname !== newEvent.nickname)                                lines.push(`**Nickname: \`${newEvent.nickname ? newEvent.nickname : "none"}\` Was: \`${event.nickname ? event.nickname : "none"}\`**`);
					else                                                                lines.push(`Nickname: \`${event.nickname ? event.nickname : "none"}\``);
					if(event.user.bot !== newEvent.user.bot)                                lines.push(`**Human: \`${newEvent.user.bot ? "no":"yes"}\` Was: \`${event.user.bot ? "no":"yes"}\`**`);
					else                                                                lines.push(`Human: \`${event.user.bot ? "no":"yes"}\``);
					if(event.joinedTimestamp !== newEvent.joinedTimestamp)                  lines.push(`**Member For: \`${dayjs().from(newEvent.joinedTimestamp, true)}\` Was: \`${dayjs().from(event.joinedTimestamp, true)}\`**`);
					else                                                                lines.push(`Member For: \`${dayjs().from(event.joinedTimestamp, true)}\``);
					if(roles.length !== newRoles.length)                                    lines.push(`**Roles: ${newRoles.length > 0 ? `<@&${newRoles.join(">, <@&")}>` : "`none`"} Was: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}**`);
					else                                                                lines.push(`Roles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`);
				}

				if(eventType === "inviteCreate" || eventType === "inviteDelete") {
					lines.push(`User: ${event.inviter}`);
					lines.push(`Channel: \`#${event.channel.name}\` (<#${event.channel.id}>)`);
					lines.push(`Invite Code: \`${event.code}\``);
					lines.push(`Expires: \`${event.expiresTimestamp ? dayjs(event.expiresTimestamp).fromNow() : "Never"}\``);
					lines.push(`Maximum Uses: \`${event.maxUses ? event.maxUses : "Unlimited"}\``);
				}

				message.setDescription(lines.join("\n"));

				// console.log(event);
				audit.send(message);

			}
		});
	});

}
