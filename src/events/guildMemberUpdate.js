module.exports = async function(guild, [ event, newEvent ]) {

	const fields = [];

	if(event.displayName !== newEvent.displayName) fields.push({
		name: "Nickname",
		value: `${event.displayName}** → **${newEvent.displayName}`,
		inline: true
	})

	if(event.user.discriminator !== newEvent.user.discriminator) fields.push({
		name: "Discriminator",
		value: `#${event.user.discriminator}** → **#${newEvent.user.discriminator}`,
		inline: true
	})

	if(Object.keys(util.parseCollection(event.roles.cache)).join(";") !== Object.keys(util.parseCollection(newEvent.roles.cache)).join(";")) fields.push({
		name: "Roles",
		value: util.arrayDiff(Object.keys(util.parseCollection(event.roles.cache)), Object.keys(util.parseCollection(newEvent.roles.cache))).map(r => `${Object.keys(util.parseCollection(newEvent.roles.cache)).includes(r) ? "+":"-"}<@&${r}>`).join(" "),
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "warn",
		sender: event,
		title:  "Updated Their Profile",
		thumb:  event.user.displayAvatarURL(),
	})

}
