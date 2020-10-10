module.exports = async function(guild, [ event ]) {

	const fields = [];

	fields.push({
		name: "Name",
		value: `\`${event.name}\``,
		inline: true
	})

	if(event.hexColor !== "#000000") fields.push({
		name: "Color",
		value: `\`${event.hexColor}\``,
		inline: true
	})

	fields.push({
		name: "Display Seperatly",
		value: event.hoist ? "`Yes`":"`No`",
		inline: true
	})

	fields.push({
		name: "Mentionable",
		value: event.mentionable ? "`Yes`":"`No`",
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "success",
		desc: event.toString(),
		title: "Role Created",
	})

}
