module.exports = async function(guild) {

	// Schedule repeating tasks
	client.setInterval(async function() {

		// Unmute members when their time expires
		global.config[guild.id].commands["mute"].persistance.map(async (entry, key) => {
			if(entry.expires < Date.now()) {
				global.config[guild.id].commands["mute"].persistance.splice(key, 1);
				await util.writeConfig(guild.id);
				unmute(entry);
			}
		})

		// Count warnings
		global.config[guild.id].commands["warn"].persistance.map(async (entry, key) => {
			if(entry.expires < Date.now()) {
				global.config[guild.id].commands["warn"].persistance.splice(key, 1);
				await util.writeConfig(guild.id);
			}
		})

	}, 1000);

	// Unmute function
	function unmute({ moderator, specimen, channel }) {

		const mod = util.parseCollection(guild.members.cache)[moderator].user
		guild.member(specimen).roles.remove(global.config[guild.id].commands["mute"].muterole);
		guild.channels.resolve(channel).send(new MessageEmbed()
		.setColor(global.config[guild.id].theme.success)
		.setFooter(guild.member(mod).displayName, guild.member(mod).user.displayAvatarURL())
		.setDescription(`<@!${specimen}> is no longer muted.`));

	}

}
