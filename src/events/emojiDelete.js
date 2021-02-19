module.exports = async function(guild, [ emoji ]) {

	// Make sure audit gets sent to right server
	if(emoji.guild.id !== guild.id) return;

	// Send audit message
	return await sendAudit(guild, {

		color: "error",
		title: `Emoji deleted`,
		thumbnail: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif":"png"}`,
		fields: [{

			// Left column
			name: "Emoji info",
			value: [
				`• Animated:`,
				`• ID:`,
				`• Name:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${emoji.animated}\`**`,
				`**\`${emoji.id}\`**`,
				`**\`${emoji.name}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
