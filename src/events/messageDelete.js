module.exports = async function(guild, [ message ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "severe",
		title: `Message deleted`,
		desc: `>>> ${message.content}`,
		fields: [{

			// Left column
			name: "Message info",
			value: [
				`• Author:`,
				`• Channel:`,
				`• ID:`,
				`• Sent on:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`${message.author}`,
				`${message.channel}`,
				`**\`${message.id}\`**`,
				`**\`${util.ts(message.createdAt)}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
