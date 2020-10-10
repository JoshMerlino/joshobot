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
		color: "error",
		title:  "Emoji Deleted",
		thumb: event.url,
	})

}
