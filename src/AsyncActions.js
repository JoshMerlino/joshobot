module.exports = async function(guild) {

	// Check for unmutes
	client.setInterval(async function() {

		// Get users that are muted
		const { persistance } = global.config[guild.id].commands["mute"];

		// Iterate over users that need an unmute
		persistance
		  .filter(({ expires }) => expires < Date.now())
		  .map(async (entry, key) => {

				// Remove entry from config
				global.config[guild.id].commands["mute"].persistance.splice(key, 1);
				await util.writeConfig(guild.id);

				// Get variables from entry
				const { moderator, specimen, channel } = entry;

				// Get the mod and user
				const mod = await util.user(moderator, guild);
				const user = await util.user(specimen, guild);

				// Remove mute role
				user.roles.remove(await util.getMuteRole(guild));

				// Formulate embed
				const embed = new MessageEmbed();
				embed.setColor(Color.success)
				embed.setFooter(mod.user.tag, mod.user.displayAvatarURL()).setTimestamp();
				embed.setDescription(`${user} is no longer muted.`);

				// Send embed
				await guild.channels.resolve(channel).send(embed);

		  });

	}, 1000);


	// If disboard is in the server
	if(util.parseCollection(guild.members.cache).hasOwnProperty("302050872383242240")) {

		// Schedule bump reminders
		client.setInterval(async function() {

			// Get disboard
			const disboard = await guild.members.fetch("302050872383242240");

			// Iterate through channels
			Object.values(util.parseCollection(guild.channels.cache)).map(async channel => {

				// If channel has disboard message in it
				const messages = Object.values(util.parseCollection(await channel.messages.fetch({ limit: 100 })))

				// Get last bump
				const bumps = messages
				  .filter(message => message.author.id === disboard.id)
				  .filter(message => message.embeds[0].color === 2406327)
				  .sort((a, b) => b.createdTimestamp - a.createdTimestamp);

				// Make sure there is already not a bump message
				if(bumps.length === 0) return;
				if(messages[0].author.id === client.user.id) return;
				if(bumps[0] !== undefined && Date.now() < bumps[0].createdTimestamp + 2*60*60*1000) return;

				// Send bump message
				await channel.send(`A bump is now available for this server. Do \`!d bump\``);

			});

		}, 5000);

	}

}
