module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("botmaster", ...arguments);
		this.register("Manages who has permission overrides for the bot. 🤖", HelpSection.MODERATION, [{
			argument: "@User | @Role",
			required: true,
		}]);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return await util.noPermissions(channel, sender)

		// Get params
		const [ subcommand = null, userOrRole = "" ] = args;
		const id = userOrRole.replace(/[\\<>@#&!]/g, "");

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Bot Masters");
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		if(userOrRole === "" || subcommand === null) {
			embed.setColor(guildConfig.theme.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		if(subcommand.toLowerCase() === "add") {
			config[guild.id].botmasters.push(id);
			embed.setColor(guildConfig.theme.success);
			embed.setDescription(`Added ${userOrRole} to bot masters.`);
			await util.writeConfig(guild.id);
            return await channel.send(embed);
		}

		if (subcommand.toLowerCase() === "remove") {
			config[guild.id].botmasters.splice(config[guild.id].botmasters.indexOf(id));
			embed.setColor(guildConfig.theme.success);
			embed.setDescription(`Removed ${userOrRole} from bot masters.`);
			await util.writeConfig(guild.id);
            return await channel.send(embed);
		}

	}

}
