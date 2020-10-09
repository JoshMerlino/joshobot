module.exports = async function(guild, [ event ]) {

	const fields = [];

	fields.push({
		name: "Name",
		value: `\\:${event.name}:`,
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "success",
		title:  "Created an Emoji",
		thumb: event.url,
		sender: { user: event.author }
	})

}
