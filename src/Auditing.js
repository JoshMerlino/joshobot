global.sendAudit = async function(guild, { color, title, desc, fields, sender, thumbnail }) {

	// Formulate embed
	const message = new MessageEmbed();
	message.setColor(Color[(color || "info")]);
	message.setFooter(`ID: ${util.uuid()}`);
	message.setTimestamp();

	// Set details
	thumbnail && message.setThumbnail(thumbnail);
	title && message.setTitle(title);
	desc && message.setDescription(desc);
	fields && message.addFields(fields);
	(sender && sender.hasOwnProperty("user") && sender.user !== null) && message.setAuthor(sender.user.tag, sender.user.displayAvatarURL());

	// Send audit to guild audit channel
	guild.channels.cache.get(config[guild.id].audit.channel).send(message);

}

// Set up function to enable auditing in guild
module.exports = async function(client, guild) {

	// Iterate through events
	(await fs.readdir(path.join(APP_ROOT, "src", "events"))).map(e => e.split(".js")[0]).map(eventType => {

		// Enable each event
		client.on(eventType, async function(...events) {

			// Make sure the event is in the right guild so other guilds dont get audits from every guild
			if(events[0].hasOwnProperty("guild") && events[0].guild.id !== guild.id) return;

			// Send audit
			require(path.join(APP_ROOT, "src", "events", `${eventType}.js`))(guild, events);

		});

	});

}
