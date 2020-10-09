module.exports = async function(guild, [ _guild, user ]) {

	const fields = [];

	const ban = guild.fetchBan(user.id);

	if(ban.reason) fields.push({
		name: "Reason",
		value: ban.reason,
		inline: true
	})

	await sendAudit(guild, {
		fields,
		color: "severe",
		title: "Was Banned",
		sender: { user }
	})

}
