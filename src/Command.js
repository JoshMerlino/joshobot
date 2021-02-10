module.exports = class Command {

	aliases = null;
	args = null;
	desc = null;
	guild_id = null

	constructor(aliases, guild_id) {

		this.aliases = aliases;

		client.on("message", async message => {

			const { content, channel, member, guild } = message;
			const [ root, ...args ] = content.split(" ");

			if(guild.id !== guild_id) return;

			aliases.map(async alias => {
				if(config[guild_id].prefix + alias === root.toLowerCase()) {
					this.guild_id = guild_id;
					await this.onCommand({
						root, args, channel, message, guild,
						sender: member,
						guildConfig: config[guild_id],
						audit: config[guild.id].audit.enabled ? guild.channels.cache.get(config[guild.id].audit.channel) : false
					});

					if(config[guild_id]["autoremove-successful-commands"]) await message.delete();

				}
			})

		});

	}

	register(description, category, args = []) {
		this.args = args;
		this.desc = description;
		if(global.help.filter(({ description: desc }) => description === desc ).length > 0) return;
		global.help.push({ aliases: this.aliases, description, category, args })
	}

	get usage() {
		return `\`${config[this.guild_id].prefix}${this.aliases[0]}${this.args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``;
	}

	get description() {
		return this.desc;
	}

}
