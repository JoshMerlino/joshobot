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
				argument: "add | remove | lock | softlock | rename | nsfw | unlock",
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

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_CHANNELS")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get params
		let [ subcommand, ch, name = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Channel");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// Switch subcommand
		switch(subcommand.toLowerCase()) {

			// Create
			case "add":
			case "a":
			case "create":
			case "cr":

				// If no channel name
				if(ch === null) ch = "new-channel";

				// Create channel
				guild.channels.create(ch).then(created => {
					embed.setColor(Color.success);
					embed.setDescription(`Created new channel: ${created.toString()}.`);
				}).catch(error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not create channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Delete
			case "delete":
			case "del":
			case "d":
			case "rm":
			case "remove":

				// If no channel use current channel
				ch = util.channel(ch || channel, guild);

				// Create channel
				ch.delete().then(function() {
					embed.setColor(Color.success);
					embed.setDescription(`Removed channel #${ch.name}`);
				}).catch(error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not remove channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Rename
			case "rename":
			case "name":
			case "rn":

				// If no new name
				if(name === null) return await this.sendUsage(channel);

				// If no channel use current channel
				ch = util.channel(ch, guild);

				// Serialize channel name
				name = name.toLowerCase();

				// Rename channel
				ch.edit({ name }).then(async function() {
					embed.setColor(Color.success);
					embed.setDescription(`Renamed channel: ${ch.toString()}`);
				}).catch(async error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not rename channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Toggle NSFW
			case "togglensfw":
			case "nsfw":

				// If no channel use current channel
				ch = util.channel(ch || channel, guild);

				// Get if channel is nsfw
				const { nsfw } = ch;

				// Rename channel
				ch.edit({ nsfw: !nsfw }).then(async function() {
					embed.setColor(Color.success);
					embed.setDescription(`${ch.toString()} is ${ nsfw ? "no longer":"now"} NSFW.`);
				}).catch(async error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not ${ nsfw ? "disable":"make"} channel NSFW.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Lock
			case "lockdown":
			case "lock":
			case "l":

				// If no channel use current channel
				ch = util.channel(ch || channel, guild);

				// Lock channel channel
				ch.overwritePermissions([{ id: guild.roles.everyone, deny: ["SEND_MESSAGES", "ADD_REACTIONS"] }]).then(async function() {
					embed.setColor(Color.success);
					embed.setDescription(`${ch.toString()} is now read-only for ${guild.roles.everyone.toString()} (locked).`);
				}).catch(async error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not lock channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Softlock
			case "softlock":
			case "sl":

				// If no channel use current channel
				ch = util.channel(ch || channel, guild);

				// Lock channel channel
				ch.overwritePermissions([{ id: guild.roles.everyone, deny: ["EMBED_LINKS", "ATTACH_FILES"] }]).then(async function() {
					embed.setColor(Color.success);
					embed.setDescription(`${ch.toString()} is now text-only for ${guild.roles.everyone.toString()} (soft-locked).`);
				}).catch(async error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not soft-lock channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

			// Unlock
			case "unlock":
			case "unsoftlock":
			case "ul":
			case "usl":

				// If no channel use current channel
				ch = util.channel(ch || channel, guild);

				// Lock channel channel
				ch.overwritePermissions([{ id: guild.roles.everyone, allow: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES"] }]).then(async function() {
					embed.setColor(Color.success);
					embed.setDescription(`${ch.toString()} is now unlocked for ${guild.roles.everyone.toString()} (unlocked).`);
				}).catch(async error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not unlock channel.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed))

				return;

		}

		// Send usage if invalid subcommand
		return await this.sendUsage(channel);

	}

}
