module.exports = async function(guild, [ event ]) {

	const fields = [];

	fields.push({
		name: "Author",
		value: event.author.toString(),
		inline: true
	})

	fields.push({
		name: "Channel",
		value: event.channel.toString(),
		inline: true
	})

	if(Object.values(util.parseCollection(event.attachments)).length > 0) fields.push({
		name: "Attachments",
		value: Object.values(util.parseCollection(event.attachments)).map(e => e.url).join("\n"),
		inline: true
	})

	fields.push({
		name: "Message",
		value: event.content.substr(0, 1000),
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "severe",
		title: "Message Deleted",
	})

}
