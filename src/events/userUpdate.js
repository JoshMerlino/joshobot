module.exports = async function(guild, [ before, after ]) {

	// Make sure user is in the guild
	if(await util.user(before.id, guild) === null) return;

	// Initialize columns
	const bef = [];
	const aft = [];

	// Compare users
	if(before.discriminator !== after.discriminator) {
		bef.push(`• Discriminator: **\`#${before.discriminator}\`**`);
		aft.push(`• Discriminator: **\`#${after.discriminator}\`**`);
	}

	if(before.local !== after.local) {
		bef.push(`• Language: **\`${before.local}\`**`);
		aft.push(`• Language: **\`${after.local}\`**`);
	}

	if(before.user.avatar !== after.user.avatar) {
		bef.push(`• Profile Picture: **[View](${before.user.displayAvatarURL()})**`);
		aft.push(`• Profile Picture: **[View](${after.user.displayAvatarURL()})**`);
	}

	if(before.username !== after.username) {
		bef.push(`• Username: **\`${before.username}\`**`);
		aft.push(`• Username: **\`${after.username}\`**`);
	}

	// Make sure empty audits arent sent
	if(bef.length === 0 || aft.length === 0) return;

	// Send audit message
	await sendAudit(guild, {

		color: "warn",
		title: "Member updated",
		thumbnail: after.displayAvatarURL(),
		desc: after,
		fields: [{

			// Left column
			name: "Before",
			value: bef.join("\n"),
			inline: true

		}, {

			// Right column
			name: "After",
			value: aft.join("\n"),
			inline: true

		}]
	})

}
