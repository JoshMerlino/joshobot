module.exports = async function(guild, [, member ]) {

	// Fetch ban
	const { user, reason } = await guild.fetchBan(member);

	// Send audit
	await sendAudit(guild, {
		color: "severe",
		title: "Banned member",
		thumbnail: user.displayAvatarURL(),
		fields: [{

			// Left column
			name: "Ban info",
			value: [
				`• Reason:`,
				`• User:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${reason === undefined ? "none" : reason}\`**`,
				`**\`${user.tag}\`**`,
			].join("\n"),
			inline: true

		}],
	});

}
