module.exports = async function(guild, [ event, newEvent ]) {

	const fields = [];

	if(event.name !== newEvent.name) fields.push({
		name: "Name",
		value: `\\:${event.name}: **→** \\:${newEvent.name}:`,
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "warn",
		title:  "Emoji Updated",
		thumb: event.url,
	})

}
