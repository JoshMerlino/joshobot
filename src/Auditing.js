global.sendAudit = async function(guild, { color, title, desc, fields, sender, thumb }) {
	const message = new MessageEmbed();
	message.setColor(config[guild.id].theme[(color || "primary").toLowerCase()])
	message.setFooter(`ID: ${util.uuid()}`)
	message.setTimestamp()

	title && message.setTitle(title)
	desc && message.setDescription(desc)
	fields && message.addFields(fields)
	thumb && message.setThumbnail(thumb)
	(sender && sender.hasOwnProperty("user") && sender.user !== null) && message.setAuthor(sender.user.tag, sender.user.displayAvatarURL());

	guild.channels.cache.get(config[guild.id].audit.channel).send(message);
}

module.exports = async function(client, guild) {

	(await fs.readdir(path.join(APP_ROOT, "src", "events"))).map(e => e.split(".js")[0]).map(eventType => {
		client.on(eventType, async function(...events) {
			if(events[0].guild.id !== guild.id) return;
			require(path.join(APP_ROOT, "src", "events", `${eventType}.js`))(guild, events);
		});
	});

}
