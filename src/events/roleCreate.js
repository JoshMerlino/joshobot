module.exports = async function(guild, [ role ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "success",
		title: `Role created`,
		desc: role,
		fields: [{

			// Left column
			name: "Role info",
			value: [
				`• Color:`,
				`• ID:`,
				`• Mentionable:`,
				`• Name:`,
				`• Position:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${role.hexColor}\`**`,
				`**\`${role.id}\`**`,
				`**\`${role.mentionable}\`**`,
				`**\`${role.name}\`**`,
				`**\`${role.position}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
