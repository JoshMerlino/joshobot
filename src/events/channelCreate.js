module.exports = async function(guild, [ channel ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "success",
		title: `Channel created`,
		fields: [{

			// Left column
			name: "Channel info",
			value: [
				`• ID: **\`${channel.id}\`**`,
				`• Name: **\`${channel.name}\`**`,
				`\n${channel}`
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`• Type: **\`${channel.type}\`**`,
				`• Position: **\`${channel.position}\`**`,
				`• Category: **\`${channel.parent ? channel.parent.name : "none"}\`**`
			].join("\n"),
			inline: true

		}],

	});

}
