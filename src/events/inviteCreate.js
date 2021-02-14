module.exports = async function(guild, [ invite ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "success",
		title: `Invite created`,
		desc: invite,
		fields: [{

			// Left column
			name: "Invite info",
			value: [
				`• Channel:`,
				`• Code:`,
				`• Expires:`,
				`• Inviter:`,
				`• Max Uses:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`${invite.channel}`,
				`**\`${invite.code}\`**`,
				`**\`${invite.maxAge === 0 ? "never" : cms(invite.maxAge * 1000, { verbose: true })}\`**`,
				`${invite.inviter}`,
				`**\`${invite.maxUses === 0 ? "unlimited" : invite.maxUses}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
