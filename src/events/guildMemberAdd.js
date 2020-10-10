module.exports = async function(guild, [ event ]) {

	// Unmute members when their time expires
	global.config[guild.id].commands["mute"].persistance.map(async (entry, key) => {
		if(entry.specimen === event.user.id) {
			const muterole = (await util.getMuteRole(guild)).id;
			await guild.member(specimen).roles.add(muterole);
		}
	})

	await sendAudit(guild, {
		color: "success",
		sender: event,
		title: "Joined the Server",
		thumb: event.user.displayAvatarURL(),
		fields: [{
			name: "Account Creation",
			value: `\`${dayjs(event.user.createdAt).format("MM/DD/YYYY HH:mm:ss")}\` • \`${dayjs(event.user.createdAt).fromNow(true)}\``,
			inline: true
		}, {
			name: "Username",
			value: `\`${event.user.username}\``,
			inline: true
		}, {
			name: "Tag",
			value: `\`${event.user.tag}\``,
			inline: true
		}]
	})

}
