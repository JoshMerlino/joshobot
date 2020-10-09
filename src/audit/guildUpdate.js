module.exports = async function(guild, [ event, newEvent ]) {

	const fields = [];

	if(event.name !== newEvent.name) fields.push({
		name: "Name",
		value: `**${event.displayName}** → **${newEvent.displayName}**`,
		inline: true
	})

	if(event.widgetEnabled !== newEvent.widgetEnabled) fields.push({
		name: "Widget Enabled",
		value: `**${event.widgetEnabled}** → **${newEvent.widgetEnabled}**`,
		inline: true
	})

	if(event.premiumTier !== newEvent.premiumTier) fields.push({
		name: "Boost Tier",
		value: `**${event.premiumTier}** → **${newEvent.premiumTier}**`,
		inline: true
	})

	if(event.mfaLevel !== newEvent.mfaLevel) fields.push({
		name: "2 Factor Authentication Requirement",
		value: `**${event.mfaLevel}** → **${newEvent.mfaLevel}**`,
		inline: true
	})

	if(event.verified !== newEvent.verified) fields.push({
		name: "Verified",
		value: `**${event.verified}** → **${newEvent.verified}**`,
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "warn",
		title:  "Server Updated",
		thumb:  newEvent.iconURL(),
	})

}
