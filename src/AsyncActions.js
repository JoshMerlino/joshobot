module.exports = async function(guild, audit) {

	// Schedule repeating tasks
	client.setInterval(async function() {

		// Unmute members when their time expires
		global.config[guild.id].commands["mute"].persistance.map(async (entry, key) => {
			if(entry.expires < Date.now()) {
				global.config[guild.id].commands["mute"].persistance.splice(key, 1);
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(global.config[guild.id]), "utf8");
				unmute(entry);
			}
		})

	}, 1000);

	// Unmute function
	function unmute({ moderator, specimen, channel }) {

		guild.member(specimen).roles.remove(global.config[guild.id].commands["mute"].muterole);
		guild.channels.resolve(channel).send(new MessageEmbed()
		.setColor(global.config[guild.id].theme.success)
		.setFooter(sender.displayName, sender.user.displayAvatarURL())
		.setDescription(`<@!${specimen}> is no longer muted.`));

		if(audit) {
			const User = util.parseCollection(guild.members.cache)[specimen].user;
			const message = new MessageEmbed()
			.setColor(global.config[guild.id].theme.severe)
			.setTitle("User Unmuted")
			.setFooter(`ID: ${specimen}`)
			.setTimestamp()
			.setThumbnail(User.displayAvatarURL())
			.setDescription(`Moderator: <@!${moderator}>\nUser: <@!${specimen}>`)
			audit.send(message);
		}

	}

}
