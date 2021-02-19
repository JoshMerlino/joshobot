module.exports = async function(guild, [ member ]) {

	// Make sure audit gets sent to right server
	if(member.guild.id !== guild.id) return;

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
