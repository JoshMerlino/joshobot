module.exports = class Command {

	key = null;
	aliases = null;

	constructor(key, guild_id) {

		this.key = key;

		const aliases = config[guild_id].commands[key].alias;
		this.aliases = aliases;

		client.on("message", async message => {

			const { content, channel, member, guild } = message;
			const [ root, ...args ] = content.split(" ");

			if(guild.id !== guild_id) return;

			aliases.map(async alias => {
				if(config[guild_id].prefix + alias === root.toLowerCase() && config[guild_id].commands[key].enabled) {

					await this.onCommand({
						root, args, channel, message, guild,
						sender: member,
						guildConfig: config[guild_id],
						audit: config[guild.id].audit.enabled ? guild.channels.cache.get(config[guild.id].audit.channel) : false
					});

					await message.delete();

				}
			})

		});

	}

}
