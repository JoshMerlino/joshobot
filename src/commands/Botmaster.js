module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"botmaster",
			"bm"
		], ...arguments);
		this.register(
			"Manages who has permission overrides for the bot. 🤖",
			HelpSection.MODERATION,
			[{
				argument: "add | remove",
				required: true,
			}, {
				argument: "@User | @Role",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return;

		// If not enough params
		if(args.length < 2) return await this.sendUsage(channel);

		// Get params
		const [ subcommand, userOrRole ] = args;
		const id = userOrRole.replace(/[\\<>@#&!]/g, "");

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Bot Masters");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// Switch subcommand
		switch(subcommand.toLowerCase()) {

			// Add
			case "add":
			case "a":

				// See if user is on botmaster list
				if(config[guild.id].botmasters.includes(id)) {
					embed.setColor(Color.error);
					embed.setDescription(`${userOrRole} is already a bot master.`)
					return await channel.send(embed);
				}

				// Add to botmaster
				config[guild.id].botmasters.push(id);

				// Save config to disk
				await util.writeConfig(guild.id);

				// Send embed
				embed.setColor(Color.success);
				embed.setDescription(`Added ${userOrRole} to bot masters.`);
				return await channel.send(embed);

			// Remove
			case "remove":
			case "r":

				// See if user is on botmaster list
				if(!config[guild.id].botmasters.includes(id)) {
					embed.setColor(Color.error);
					embed.setDescription(`${userOrRole} is not a bot master.`)
					return await channel.send(embed);
				}

				// Remove from botmaster
				config[guild.id].botmasters.splice(config[guild.id].botmasters.indexOf(id));

				// Save config to disk
				await util.writeConfig(guild.id);

				// Send embed
				embed.setColor(Color.success);
				embed.setDescription(`Added ${userOrRole} to bot masters.`);
				return await channel.send(embed);

		};

		// If unknown subcommand
		return await this.sendUsage(channel);

	}

}
