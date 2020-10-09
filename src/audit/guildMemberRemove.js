module.exports = async function(guild, [ event ]) {

	await sendAudit(guild, {
		color: "error",
		sender: event,
		title:  "Left the Server",
		thumb:  event.user.displayAvatarURL(),
		fields: [{
			name: "Account Creation",
			value: `${dayjs(event.user.createdAt).format()} • ${dayjs(event.user.createdAt).fromNow(true)}`,
			inline: true
		}, {
			name: "Server Member Since",
			value: `${dayjs(event.joinedAt).format()} • ${dayjs(event.joinedAt).fromNow(true)}`,
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
