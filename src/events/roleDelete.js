module.exports = async function(guild, [ role ]) {

	// Make sure audit gets sent to right server
	if(role.guild.id !== guild.id) return;

	// Send audit message
	return await sendAudit(guild, {

		color: "error",
		title: `Role deleted`,
		desc: role,
		fields: [{

			// Left column
			name: "Role info",
			value: [
				`• Color:`,
				`• ID:`,
				`• Name:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${role.hexColor}\`**`,
				`**\`${role.id}\`**`,
				`**\`${role.name}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
