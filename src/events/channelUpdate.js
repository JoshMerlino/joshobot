module.exports = async function(guild, [ event, newEvent ]) {

	const fields = [];

	if(event.name !== newEvent.name) fields.push({
		name: "Name",
		value: `\`#${event.name}\` → \`#${newEvent.name}\``,
		inline: true
	})

	if(event.viewable !== newEvent.viewable) fields.push({
		name: "Viewable",
		value: `${event.viewable ? "`Yes`":"`No`"} → ${newEvent.viewable ? "`Yes`":"`No`"}`,
		inline: true
	})

	if(event.nsfw !== newEvent.nsfw) fields.push({
		name: "NSFW",
		value: `${event.nsfw ? "`Yes`":"`No`"} → ${newEvent.nsfw ? "`Yes`":"`No`"}`,
		inline: true
	})

	if(event.topic !== newEvent.topic) fields.push({
		name: "Topic",
		value: `${event.topic ? `\`${event.topic}\``:`_\`NONE\`_`} → ${newEvent.topic ? `\`${newEvent.topic}\``:`_\`NONE\`_`}`,
		inline: true
	})

	if(event.type !== newEvent.type) fields.push({
		name: "Type",
		value: `${event.type} → ${newEvent.type}`,
		inline: true
	})

	if(event.parent.name !== newEvent.parent.name) fields.push({
		name: "Channel Category",
		value: `${event.parent.name ? `\`${event.parent.name}\``:`_\`NONE\`_`} → ${newEvent.parent.name ? `\`${newEvent.parent.name}\``:`_\`NONE\`_`}`,
		inline: true
	})

	if(event.permissionsLocked !== newEvent.permissionsLocked) fields.push({
		name: "Synced Permissions",
		value: `${event.permissionsLocked ? "`Yes`":"`No`"} → ${newEvent.permissionsLocked ? "`Yes`":"`No`"}`,
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "warn",
		desc: newEvent.toString(),
		title: "Channel Updated",
	})

}
