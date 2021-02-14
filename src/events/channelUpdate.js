module.exports = async function(guild, [ before, after ]) {

	// Initialize columns
	const bef = [];
	const aft = [];

	// Compare channels
	if(before.parentID !== after.parentID) {
		bef.push(`• Category: **\`${before.parent ? before.parent.name : "none"}\`**`);
		aft.push(`• Category: **\`${after.parent ? after.parent.name : "none"}\`**`);
	}

	if(before.name !== after.name) {
		bef.push(`• Name: **\`${before.name}\`**`);
		aft.push(`• Name: **\`${after.name}\`**`);
	}

	if(before.nsfw !== after.nsfw) {
		bef.push(`• NSFW: **\`${before.nsfw}\`**`);
		aft.push(`• NSFW: **\`${after.nsfw}\`**`);
	}

	if(before.rateLimitPerUser !== after.rateLimitPerUser) {
		bef.push(`• Slow mode: **\`${before.rateLimitPerUser === 0 ? "none" : cms(before.rateLimitPerUser * 1000, { verbose: true })}\`**`);
		aft.push(`• Slow mode: **\`${after.rateLimitPerUser === 0 ? "none" : cms(after.rateLimitPerUser * 1000, { verbose: true })}\`**`);
	}

	if(before.topic !== after.topic) {
		bef.push(`• Topic: **\`${before.topic ? before.topic : "none"}\`**`);
		aft.push(`• Topic: **\`${after.topic ? after.topic : "none"}\`**`);
	}

	if(before.type !== after.type) {
		bef.push(`• Type: **\`${before.type}\`**`);
		aft.push(`• Type: **\`${after.type}\`**`);
	}

	// Make sure empty audits arent sent
	if(bef.length === 0 || aft.length === 0) return;

	// Send audit message
	await sendAudit(guild, {

		color: "warn",
		title: "Channel updated",
		fields: [{

			// Left column
			name: "Before",
			value: `${bef.join("\n")}\n\n${after}`,
			inline: true

		}, {

			// Right column
			name: "After",
			value: aft.join("\n"),
			inline: true

		}]
	})

}
