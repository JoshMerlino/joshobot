module.exports = async function(guild, [ member ]) {

	// Make sure audit gets sent to right server
	if(member.guild.id !== guild.id) return;

	// Send audit
	await sendAudit(guild, {
		color: "error",
		title: "Member left",
		thumbnail: member.displayAvatarURL(),
		fields: [{

			// Left column
			name: "Member info",
			value: [
				`• Account age:`,
				`• Bot:`,
				`• Member since:`,
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
				`**\`${util.ts(member.joinedAt)}\`**`,
				`**\`${member.user.username}\`**`,
				`**\`${member.user.tag}\`**`,
			].join("\n"),
			inline: true

		}],
	});

}
