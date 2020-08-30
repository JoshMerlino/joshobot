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
			aliases.map(alias => {
				if(config[guild_id].prefix + alias === root.toLowerCase() && config[guild_id].commands[key].enabled) this.onCommand({ root, args, sender: member, channel, guildConfig: config[guild_id], guild });
			})
		})
	}
}
