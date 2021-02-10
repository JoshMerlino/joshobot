module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"channel",
			"ch"
		], ...arguments);
		this.register(
			"Manages server channels. #️⃣",
			HelpSection.MODERATION,
			[{
				argument: "add,create | delete,remove | lock | softlock | rename | nsfw | unlock",
				required: true,
			}, {
				argument: "Channel | #Channel",
				required: false,
			}, {
				argument: "Name",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild, message }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_CHANNELS"))  return await util.noPermissions(channel, sender)

		// Get params
		let [ subcommand = null, ch = null, name = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Channel");
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		if(subcommand === null) {
			embed.setColor(Color.warn);
			embed.addField("Description", this.description, true)
			embed.addField("Usage", this.usage, true)
            return await channel.send(embed);
		}

		if (subcommand.toLowerCase() === "add" || subcommand.toLowerCase() === "create") {
			if(ch === null) ch = "new-channel";
			const created = await guild.channels.create(ch);
			embed.setColor(Color.success);
			embed.addField("Created", created.toString(), true)
            return await channel.send(embed);
		}

		if (subcommand.toLowerCase() === "delete" || subcommand.toLowerCase() === "remove") {
			ch = message.mentions.channels.first() || channel
			ch.delete().then(async function() {
				embed.setColor(Color.success);
				embed.addField("Removed", `#${ch.name}`, true)
	            return await channel.send(embed);
			}).catch(async error => {
				embed.setColor(Color.error);
				embed.addField("Error", error.toString().split(":")[2], true)
	            return await channel.send(embed);
			})
		}

		if (subcommand.toLowerCase() === "rename") {
			ch = message.mentions.channels.first() || channel;
			ch.edit({ name: (name === null ? args[1] : name).toLowerCase().replace(/\s/g, "-") }).then(async function() {
				embed.setColor(Color.success);
				embed.addField("Renamed", ch.toString(), true)
				return await channel.send(embed);
			}).catch(async error => {
				embed.setColor(Color.error);
				embed.addField("Error", error.toString().split(":")[2], true)
	            return await channel.send(embed);
			})
		}

		if (subcommand.toLowerCase() === "nsfw") {
			ch = util.channel(ch || channel, guild);
			const { nsfw } = ch;
			ch.edit({ nsfw: !nsfw });
			embed.setColor(Color.success);
			embed.addField("Channel", ch.toString(), true)
			embed.addField("NSFW", !nsfw ? "\`Yes\`" : "\`No\`", true)
			return await channel.send(embed);

		}

		if(subcommand.toLowerCase() === "lock") {
			ch = message.mentions.channels.first() || channel
			await ch.overwritePermissions([{ id: guild.roles.everyone, deny: ["SEND_MESSAGES", "ADD_REACTIONS"] }]);
			embed.setColor(Color.success);
			embed.addField("Locked", ch.toString(), true)
			return await channel.send(embed);
		}

		if(subcommand.toLowerCase() === "unlock") {
			ch = message.mentions.channels.first() || channel
			await ch.overwritePermissions([{ id: guild.roles.everyone, allow: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES"] }]);
			embed.setColor(Color.success);
			embed.addField("Unlocked", ch.toString(), true)
			return await channel.send(embed);
		}

		if(subcommand.toLowerCase() === "softlock") {
			ch = message.mentions.channels.first() || channel;
			await ch.overwritePermissions([{ id: guild.roles.everyone, deny: ["EMBED_LINKS", "ATTACH_FILES"] }]);
			embed.setColor(Color.success);
			embed.addField("Soft Locked", ch.toString(), true)
			return await channel.send(embed);
		}

	}

}
