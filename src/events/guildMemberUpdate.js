module.exports = async function(guild, [ before, after ]) {

	// Initialize columns
	const bef = [];
	const aft = [];

	// Compare users
	if(before.displayHexColor !== after.displayHexColor) {
		bef.push(`• Color: **\`${before.displayHexColor}\`**`);
		aft.push(`• Color: **\`${after.displayHexColor}\`**`);
	}

	if(before.user.local !== after.user.local) {
		bef.push(`• Language: **\`${before.user.local}\`**`);
		aft.push(`• Language: **\`${after.user.local}\`**`);
	}

	if(before.nickname !== after.nickname) {
		bef.push(`• Nickname: **\`${before.nickname ? before.nickname : before.user.username}\`**`);
		aft.push(`• Nickname: **\`${after.nickname ? after.nickname : after.user.username}\`**`);
	}

	if(before.user.avatar !== after.user.avatar) {
		bef.push(`• Profile Picture: **\`[View](${before.user.displayAvatarURL()})\`**`);
		aft.push(`• Profile Picture: **\`[View](${after.user.displayAvatarURL()})\`**`);
	}

	if(Object.values(util.parseCollection(before.roles.cache)).join() !== Object.values(util.parseCollection(after.roles.cache)).join()) {
		bef.push(`• Roles: ${Object.values(util.parseCollection(before.roles.cache)).filter(role => role.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map(role => role.toString()).join(", ")}`);
		aft.push(`• Roles: ${Object.values(util.parseCollection(after.roles.cache)).filter(role => role.name !== "@everyone").sort((a, b) => b.rawPosition - a.rawPosition).map(role => role.toString()).join(", ")}`);
	}

	// Make sure empty audits arent sent
	if(bef.length === 0 || aft.length === 0) return;

	// Send audit message
	await sendAudit(guild, {

		color: "warn",
		title: "Member updated",
		thumbnail: after.user.displayAvatarURL(),
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
