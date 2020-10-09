module.exports = async function(guild, [ _guild, user ]) {

	await sendAudit(guild, {
		color: "severe",
		title: "Is No Longer Banned",
		sender: { user }
	})

}
