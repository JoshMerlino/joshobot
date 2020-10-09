module.exports = async function(guild, [ event, newEvent ]) {

	const fields = [];

	if(event.name !== newEvent.name) fields.push({
		name: "Name",
		value: `${event.name}** → **${newEvent.name}`,
		inline: true
	})

	if(event.hexColor !== newEvent.hexColor) fields.push({
		name: "Color",
		value: `#${event.hexColor}** → **#${newEvent.hexColor}`,
		inline: true
	})

	if(event.hoist !== newEvent.hoist) fields.push({
		name: "Display Seperatly",
		value: `${event.hoist ? "YES":"NO"}** → **${newEvent.hoist ? "YES":"NO"}`,
		inline: true
	})

	if(event.mentionable !== newEvent.mentionable) fields.push({
		name: "Mentionable",
		value: `${event.mentionable ? "YES":"NO"}** → **${newEvent.mentionable ? "YES":"NO"}`,
		inline: true
	})

	if(event.permissions.toArray().join(";") !== newEvent.permissions.toArray().join(";")) fields.push({
		name: "Permission Changes",
		value: util.arrayDiff(event.permissions.toArray(), newEvent.permissions.toArray()).map(r => `\`${newEvent.permissions.toArray().includes(r) ? "+":"-"}${r.toUpperCase()}\``).join(" "),
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "warn",
		desc: newEvent.toString(),
		title:  "Role Updated",
	})

}
