module.exports = async function(guild, [ before, after ]) {

	// Initialize columns
	const bef = [];
	const aft = [];

	// Compare roles
	if(before.hexColor !== after.hexColor) {
		bef.push(`• Color: **\`${before.hexColor}\`**`);
		aft.push(`• Color: **\`${after.hexColor}\`**`);
	}

	if(before.hoist !== after.hoist) {
		bef.push(`• Hoisted: **\`${before.hoist}\`**`);
		aft.push(`• Hoisted: **\`${after.hoist}\`**`);
	}

	if(before.mentionable !== after.mentionable) {
		bef.push(`• Mentionable: **\`${before.mentionable}\`**`);
		aft.push(`• Mentionable: **\`${after.mentionable}\`**`);
	}

	if(before.name !== after.name) {
		bef.push(`• Name: **\`${before.name}\`**`);
		aft.push(`• Name: **\`${after.name}\`**`);
	}

	if(before.position !== after.position) {
		bef.push(`• Position: **\`${before.position}\`**`);
		aft.push(`• Position: **\`${after.position}\`**`);
	}

	// Make sure empty audits arent sent
	if(bef.length === 0 || aft.length === 0) return;

	// Send audit message
	await sendAudit(guild, {

		color: "warn",
		title: "Role updated",
		thumbnail: after.iconURL(),
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
