module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"role"
		], ...arguments);
		this.register(
			"Manage server roles. 🧻",
			HelpSection.MODERATION,
			[{
				argument: "add, give, a | create, new | delete, del, d | remove, take, r",
				required: true,
			}, {
				argument: "Role | @Role",
				required: true,
			}, {
				argument: "@User | #RRGGBB",
				required: false,
			}]
		);
	}

	async onCommand({ args, sender, guildConfig, channel, guild }) {

		// Make sure sender is a bot master
		if(!util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) return;

		// If not enough args
		if(args.length < 1) return await this.sendUsage(channel);

		// Get params
		let [ subcommand, name = null ] = args;

		// Start formulating embed
		const embed = new MessageEmbed();
		embed.setTitle("Role");
		embed.setFooter(sender.user.tag, sender.user.displayAvatarURL()).setTimestamp();

		// Switch subcommand
		switch(subcommand.toLowerCase()) {

			// Create
			case "new":
			case "create":

				// If no name given
				if(name === null) name = "New-role";

				// Serialize name
				name = name.replace(/\-/gm, " ");

				// Create role
				guild.roles.create({ data: { name, color: args[2] || "#000000" } }).then(created => {
					embed.setColor(Color.success);
					embed.setDescription(`Created new role: ${created.toString()}.`);
				}).catch(error => {
					embed.setColor(Color.error);
					embed.setDescription(`Could not create role.\n${error.toString().split(":")[2]}`);
				}).finally(async () => await channel.send(embed));

				return;

			// Delete
			case "d":
			case "del":
			case "delete":

				// If no name given
				if(name === null) return await this.sendUsage(channel);

				try {

					// Get role
					const role = await util.role(name, guild);

					// Create role
					role.delete().then(() => {
						embed.setColor(Color.success);
						embed.setDescription(`Deleted role: *@${role.name}*.`);
					}).catch(error => {
						embed.setColor(Color.error);
						embed.setDescription(`Could not delete role.\n${error.toString().split(":")[2]}`);
					}).finally(async () => await channel.send(embed));

				} catch(err) {
					embed.setColor(Color.error);
					embed.setDescription(`Could not delete role.\n*@${name}* does not exist.`);
					await channel.send(embed);
				}

				return;

			// Add
			case "add":
			case "give":
			case "a":

				// If no name given
				if(name === null || args[2] === undefined) return await this.sendUsage(channel);

				try {

					// Get role and user
					const role = await util.role(name, guild);
					const user = await util.user(args[2], guild);

					// Create role
					guild.member(user).roles.add(role.id).then(() => {
						embed.setColor(Color.success);
						embed.setDescription(`Added ${role.toString()} to ${user.toString()}.`);
					}).catch(async error => {
						embed.setColor(Color.error);
						embed.setDescription(`Could add role.\n${error.toString().split(":")[1]}.`);
					}).finally(async () => await channel.send(embed));

				} catch(err) {
					await this.sendUsage(channel);
				}

				return;

			// Remove
			case "remove":
			case "t":
			case "take":

				// If no name given
				if(name === null || args[2] === undefined) return await this.sendUsage(channel);

				try {

					// Get role and user
					const role = await util.role(name, guild);
					const user = await util.user(args[2], guild);

					// Create role
					guild.member(user).roles.remove(role.id).then(() => {
						embed.setColor(Color.success);
						embed.setDescription(`Removed ${role.toString()} from ${user.toString()}.`);
					}).catch(async error => {
						embed.setColor(Color.error);
						embed.setDescription(`Could remove role.\n${error.toString().split(":")[1]}.`);
					}).finally(async () => await channel.send(embed));

				} catch(err) {
					await this.sendUsage(channel);
				}

				return;

		}

		// Send usage if invalid subcommand
		return await this.sendUsage(channel);

	}

}
