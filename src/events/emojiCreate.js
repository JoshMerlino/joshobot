module.exports = async function(guild, [ emoji ]) {

	// Send audit message
	return await sendAudit(guild, {

		color: "success",
		title: `Emoji created`,
		thumbnail: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif":"png"}`,
		fields: [{

			// Left column
			name: "Emoji info",
			value: [
				`• ID: **\`${emoji.id}\`**`,
				`• Animated: **\`${emoji.animated}\`**`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`• Name: **\`${emoji.name}\`**`,
				`• Uploaded by: **${await emoji.fetchAuthor()}**`,
			].join("\n"),
			inline: true

		}],

	});

}
