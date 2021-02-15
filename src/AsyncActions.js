module.exports = async function(guild) {

	// Schedule unmute
	client.setInterval(async function() {
		global.config[guild.id].commands["mute"].persistance.map(async (entry, key) => {
			if(entry.expires < Date.now()) {
				global.config[guild.id].commands["mute"].persistance.splice(key, 1);
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(global.config[guild.id]), "utf8");
				const { moderator, specimen, channel } = entry;
				const mod = util.parseCollection(guild.members.cache)[moderator].user
				guild.member(specimen).roles.remove(global.config[guild.id].commands["mute"].muterole);
				guild.channels.resolve(channel).send(new MessageEmbed()
				.setColor(global.config[guild.id].theme.success)
				.setFooter(guild.member(mod).displayName, guild.member(mod).user.displayAvatarURL())
				.setDescription(`<@!${specimen}> is no longer muted.`));
			}
		})
	}, 1000);


	// If disboard is in the server
	if(util.parseCollection(guild.members.cache).hasOwnProperty("302050872383242240")) {

		// Schedule bump reminders
		client.setInterval(async function() {

			// Get disboard
			const disboard = await guild.members.fetch("302050872383242240");

			// Iterate through channels
			Object.values(util.parseCollection(guild.channels.cache)).map(async channel => {
				try {

					// If channel has disboard message in it
					const messages = Object.values(util.parseCollection(await channel.messages.fetch({ limit: 100 })))

					// Get last bump
					const bumps = messages.filter(message => message.author.id === disboard.id)
					  .filter(message => message.embeds[0].color === 2406327)
					  .sort((a, b) => b.createdTimestamp - a.createdTimestamp)

					// Make sure there is already not a bump message
					if(bumps.length === 0) return;
					if(messages[0].author.id === client.user.id) return;
					if(messages !== undefined && Date.now() < messages.createdTimestamp + 2*60*60*1000) return;

					// Send bump message
					await channel.send(`A bump is now available for this server. Do \`!d bump\``);

				} catch(err) {

				}
			});

		}, 5000);

	}

}
