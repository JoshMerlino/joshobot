function serializePermissions(permissions) {
	let result = [];
	for (const key in permissions) result.push(`${permissions[key] ? "+":"-"}${key}`);
	return result.length === 0 ? "DEFAULT" : result.join(" ");
}

function serializePermissionsDiffrences(perms1, perms2) {
	let result = {};
	for (const key in perms1) if(perms1[key] !== perms2[key]) result[key] = perms1[key];
	return serializePermissions(result);
}

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
					else 															    	lines.push(`Channel: \`#${newEvent.name}\` (<#${newEvent.id}>)`);
					if(event.nsfw !== newEvent.nsfw) 										lines.push(`**NSFW: \`${newEvent.nsfw ? "`yes`":"`no`"}\` Was: ${event.nsfw ? "`yes`":"`no`"}**`)
					else 																    lines.push(`NSFW: \`${newEvent.nsfw ? "`yes`":"`no`"}\``);
					if(newEvent.permissionOverwrites.equals(event.permissionOverwrites)) 	lines.push(`**Private Channel: \`${Array.from(newEvent.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\` Was: ${Array.from(event.permissionOverwrites).length > 0 ? "`yes`":"`no`"}**`)
					else 																    lines.push(`Private Channel: \`${Array.from(newEvent.permissionOverwrites).length > 0 ? "`yes`":"`no`"}\``);
					if(event.topic !== newEvent.topic) 										lines.push(`**Topic: \`${newEvent.topic || "none"}\` Was: \`${event.topic || "none"}\`**`)
					else 																    lines.push(`Topic: \`${newEvent.topic || "none"}\``);
				}

				if(eventType === "guildMemberAdd" || eventType === "guildMemberRemove") {
					const roles = util.parseCollection(event.guild.members.cache)[event.id]._roles
					message.setThumbnail(event.user.displayAvatarURL());
																							lines.push(`Member: ${event.user.toString()}`)
																							lines.push(`Username: \`${event.user.username}\``);
																							lines.push(`Discriminator : \`#${event.user.discriminator}\``);
																							lines.push(`Nickname: \`${event.nickname ? event.nickname : "none"}\``);
																							lines.push(`Human: \`${event.user.bot ? "no":"yes"}\``);
																							lines.push(`${eventType === "guildMemberAdd" ? "Discord" : "Server"} Member for: \`${dayjs().from(eventType === "guildMemberAdd" ? event.user.createdTimestamp : event.joinedTimestamp, true)}\``);
																							lines.push(`Roles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`);
				}

				if(eventType === "guildMemberUpdate") {
					const roles = util.parseCollection(event.guild.members.cache)[event.id]._roles
					const newRoles = util.parseCollection(event.guild.members.cache)[newEvent.id]._roles
					message.setThumbnail(event.user.displayAvatarURL());
					if(event.user.id !== newEvent.user.id)                                  lines.push(`**Member: ${newEvent.user.toString()} Was: ${event.user.toString()}**`);
					else                                                                	lines.push(`Member: ${event.user.toString()}`);
					if(event.user.username !== newEvent.user.username)                      lines.push(`**Username: \`${newEvent.user.username}\` Was: \`${event.user.username}\`**`);
					else                                                                	lines.push(`Username: \`${event.user.username}\``);
					if(event.user.discriminator !== newEvent.user.discriminator)            lines.push(`**Discriminator : \`#${newEvent.user.discriminator}\` Was: \`#${event.user.discriminator}\`**`);
					else                                                                	lines.push(`Discriminator : \`#${event.user.discriminator}\``);
					if(event.nickname !== newEvent.nickname)                                lines.push(`**Nickname: \`${newEvent.nickname ? newEvent.nickname : "none"}\` Was: \`${event.nickname ? event.nickname : "none"}\`**`);
					else                                                                	lines.push(`Nickname: \`${event.nickname ? event.nickname : "none"}\``);
					if(event.user.bot !== newEvent.user.bot)                                lines.push(`**Human: \`${newEvent.user.bot ? "no":"yes"}\` Was: \`${event.user.bot ? "no":"yes"}\`**`);
					else                                                               	    lines.push(`Human: \`${event.user.bot ? "no":"yes"}\``);
					if(event.joinedTimestamp !== newEvent.joinedTimestamp)                  lines.push(`**Member For: \`${dayjs().from(newEvent.joinedTimestamp, true)}\` Was: \`${dayjs().from(event.joinedTimestamp, true)}\`**`);
					else                                                               	    lines.push(`Member For: \`${dayjs().from(event.joinedTimestamp, true)}\``);
					if(roles.length !== newRoles.length)                                    lines.push(`**Roles: ${newRoles.length > 0 ? `<@&${newRoles.join(">, <@&")}>` : "`none`"} Was: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}**`);
					else                                                               	    lines.push(`Roles: ${roles.length > 0 ? `<@&${roles.join(">, <@&")}>` : "`none`"}`);
				}

				if(eventType === "inviteCreate" || eventType === "inviteDelete") {
																							lines.push(`User: ${event.inviter}`);
																							lines.push(`Channel: \`#${event.channel.name}\` (<#${event.channel.id}>)`);
																							lines.push(`Invite Code: \`${event.code}\``);
																							lines.push(`Expires: \`${event.expiresTimestamp ? dayjs(event.expiresTimestamp).fromNow() : "Never"}\``);
																							lines.push(`Maximum Uses: \`${event.maxUses ? event.maxUses : "Unlimited"}\``);
				}

				if(eventType === "roleCreate" || eventType === "roleDelete") {
																							lines.push(`Name: ${event.name}`);
																							lines.push(`Color: \`${event.hexColor}\``);
																							lines.push(`Position: \`${event.position}\``);
																							lines.push(`Hoisted (Displays Separately): \`${event.hoist ? "yes":"no"}\``);
																							lines.push(`Mentionable: \`${event.mentionable ? "yes":"no"}\``);
																							lines.push(`Permissions: \`${serializePermissionsDiffrences(guild.roles.everyone.permissions.serialize(), event.permissions.serialize())}\``);
				}

				if(eventType === "roleUpdate") {
					if(event.name !== newEvent.name)                     					lines.push(`**Name: \`${newEvent.name}\` Was: \`${event.name}\`**`);
					else                                                                	lines.push(`Name: \`${event.name}\``);
					if(event.hexColor !== newEvent.hexColor)                     			lines.push(`**Color: \`${newEvent.hexColor}\` Was: \`${event.hexColor}\`**`);
					else                                                                	lines.push(`Color: \`${event.hexColor}\``);
					if(event.hoist !== newEvent.hoist)                     					lines.push(`**Hoisted (Displays Separately): \`${newEvent.hoist ? "yes":"no"}\` Was: \`${event.hoist ? "yes":"no"}\`**`);
					else                                                                	lines.push(`Hoisted (Displays Separately): \`${event.hoist ? "yes":"no"}\``);
					if(event.mentionable !== newEvent.mentionable)                     		lines.push(`**Mentionable: \`${newEvent.mentionable ? "yes":"no"}\` Was: \`${event.mentionable ? "yes":"no"}\`**`);
					else                                                                	lines.push(`Mentionable: \`${event.mentionable ? "yes":"no"}\``);
					if(serializePermissions(event.permissions.serialize()) === serializePermissions(newEvent.permissions.serialize())) lines.push(`Permissions: \`${serializePermissionsDiffrences(guild.roles.everyone.permissions.serialize(), event.permissions.serialize())}\``);
					else                                                                	lines.push(`**Permissions: \`${serializePermissionsDiffrences(newEvent.permissions.serialize(), event.permissions.serialize())}\`**`);
				}

				// Hide audit if no visible information was changed.
				if(eventType.toLowerCase().indexOf("update") > -1 && lines.join("\n").indexOf("**") === -1) return;

				message.setDescription(lines.join("\n"));

				audit.send(message);

			}
		});
	});

}
