module.exports = async function(guild, [ member ]) {

	// Mute members that tried to mute evade
	global.config[guild.id].commands["mute"].persistance.map(async entry => {
		if(entry.specimen === member.user.id) {
			const muterole = (await util.getMuteRole(guild)).id;
			await guild.member(specimen).roles.add(muterole);
		}
	})

	// Send audit
	await sendAudit(guild, {
		color: "success",
		title: "Member joined",
		thumbnail: member.displayAvatarURL(),
		desc: member,
		fields: [{

			// Left column
			name: "Member info",
			value: [
				`• Account age:`,
				`• Bot:`,
				`• Language:`,
				`• Username:`,
				`• Tag:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${util.ts(member.createdAt)}\`**`,
				`**\`${member.user.bot}\`**`,
				`**\`${member.user.local}\`**`,
				`**\`${member.user.username}\`**`,
				`**\`${member.user.tag}\`**`,
			].join("\n"),
			inline: true

		}],
	});

}
