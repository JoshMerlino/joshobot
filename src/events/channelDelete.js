module.exports = async function(guild, [ channel ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "error",
		title: `Channel deleted`,
		fields: [{

			// Left column
			name: "Channel info",
			value: [
				`• ID: **\`${channel.id}\`**`,
				`• Name: **\n${channel.name}\n**`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`• Type: **\n${channel.type}\n**`,
				`• Category: **\n${channel.parent ? channel.parent.name : "none"}\n**`
			].join("\n"),
			inline: true

		}],

	});

}
