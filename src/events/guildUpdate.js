module.exports = async function(guild, [ before, after ]) {

	// Initialize columns
	const bef = [];
	const aft = [];

	// Compare guilds
	if(before.banner !== after.banner) {
		bef.push(`• Banner: **\`${before.bannerURL() ? `[View](${before.bannerURL()})` : "none"}\`**`);
		aft.push(`• Banner: **\`${after.bannerURL() ? `[View](${after.bannerURL()})` : "none"}\`**`);
	}

	if(before.explicitContentFilter !== after.explicitContentFilter) {
		bef.push(`• Content Filter: **\`${before.explicitContentFilter}\`**`);
		aft.push(`• Content Filter: **\`${after.explicitContentFilter}\`**`);
	}

	if(before.description !== after.description) {
		bef.push(`• Description: **\`${before.description ? before.description: "none"}\`**`);
		aft.push(`• Description: **\`${after.description ? after.description: "none"}\`**`);
	}

	if(before.icon !== after.icon) {
		bef.push(`• Icon: **\`${before.iconURL() ? `[View](${before.iconURL()})` : "none"}\`**`);
		aft.push(`• Icon: **\`${after.iconURL() ? `[View](${after.iconURL()})` : "none"}\`**`);
	}

	if(before.name !== after.name) {
		bef.push(`• Name: **\`${before.name}\`**`);
		aft.push(`• Name: **\`${after.name}\`**`);
	}

	if(before.ownerID !== after.ownerID) {
		bef.push(`• Name: **\`${before.owner}\`**`);
		aft.push(`• Name: **\`${after.owner}\`**`);
	}

	if(before.verificationLevel !== after.verificationLevel) {
		bef.push(`• Verification Level: **\`${before.verificationLevel}\`**`);
		aft.push(`• Verification Level: **\`${after.verificationLevel}\`**`);
	}

	if(before.verified !== after.verified) {
		bef.push(`• Verified: **\`${before.verified}\`**`);
		aft.push(`• Verified: **\`${after.verified}\`**`);
	}

	if(before.discoverySplash !== after.discoverySplash) {
		bef.push(`• Splash Screen: **\`${before.discoverySplashURL() ? `[View](${before.discoverySplashURL()})` : "none"}\`**`);
		aft.push(`• Splash Screen: **\`${after.discoverySplashURL() ? `[View](${after.discoverySplashURL()})` : "none"}\`**`);
	}

	// Make sure empty audits arent sent
	if(bef.length === 0 || aft.length === 0) return;

	// Send audit message
	await sendAudit(guild, {

		color: "warn",
		title: "Server updated",
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
