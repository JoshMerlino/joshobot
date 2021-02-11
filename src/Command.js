module.exports = class Command {

	// Set static properties
	aliases = null;
	args = null;
	desc = null;
	guild_id = null

	// Initialize command aliases
	constructor(aliases, guild_id) {

		// Set aliases to class
		this.aliases = aliases;

		// On client message
		client.on("message", async message => {

			// Get properties from message
			const { content, channel, member, guild } = message;

			// Get command root
			const [ root ] = content.split(" ");

			// Get command args
			const args = content.replace(/\s\s+/g, " ").split(" ").splice(1);

			// Make sure the command executes in the context of the right guild
			if(guild.id !== guild_id) return;

			// Iterate through aliases
			aliases.map(async alias => {

				// If message is an alias of a command
				if(config[guild_id].prefix + alias === root.toLowerCase()) {

					// Set executing guild
					this.guild_id = guild_id;

					// Run onCommand function
					await this.onCommand({
						root, args, channel, message, guild,
						sender: member,
						guildConfig: config[guild_id],
						audit: config[guild.id].audit.enabled ? guild.channels.cache.get(config[guild.id].audit.channel) : false
					});

					// If its enabled in config, delete origional command
					if(config[guild_id]["autoremove-successful-commands"]) await message.delete();

				}
			})

		});

	}

	// Register command in help
	register(description, category, args = []) {

		// Set properties
		this.args = args;
		this.desc = description;

		// Ensure command isnt already on help
		if(global.help.filter(({ description: desc }) => description === desc ).length > 0) return;

		// Add to help index
		global.help.push({ aliases: this.aliases, description, category, args });

	}

	// Get command usage
	get usage() {
		return `\`${config[this.guild_id].prefix}${this.aliases[0]}${this.args.map(({ required, argument }) => ` ${required ? "<":"("}${argument}${required ? ">":")"}`).join("")}\``;
	}

	// Get command description
	get description() {
		return this.desc;
	}

	// Send command usage
	async sendUsage(channel) {
		const embed = new MessageEmbed();
		embed.setTitle("Incorrect Usage!");
		embed.setColor(Color.warn);
		embed.addField("Description", this.description, true)
		embed.addField("Usage", this.usage, true)
		return await channel.send(embed);
	}

}
