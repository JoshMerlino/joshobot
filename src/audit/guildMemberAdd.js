module.exports = async function(guild, [ event ]) {

	await sendAudit(guild, {
		color: "success",
		sender: event,
		title:  "Joined the Server",
		thumb:  event.user.displayAvatarURL(),
		fields: [{
			name: "Account Creation",
			value: `${dayjs(event.user.createdAt).format()} • ${dayjs(event.user.createdAt).fromNow(true)}`,
			inline: true
		}, {
			name: "Username",
			value: event.user.username,
			inline: true
		}, {
			name: "Tag",
			value: event.user.tag,
			inline: true
		}]
	})

}
