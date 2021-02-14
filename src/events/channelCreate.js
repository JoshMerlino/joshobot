module.exports = async function(guild, [ channel ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "success",
		title: `Channel created`,
		desc: channel,
		fields: [{

			// Left column
			name: "Channel info",
			value: [
				`• Category:`,
				`• ID:`,
				`• Name:`,
				`• Position:`,
				`• Type:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${channel.parent ? channel.parent.name : "none"}\`**`,
				`**\`${channel.id}\`**`,
				`**\`${channel.name}\`**`,
				`**\`${channel.position}\`**`,
				`**\`${channel.type}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
