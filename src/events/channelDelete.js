module.exports = async function(guild, [ event ]) {

	if(event.type === "text") {
		const fields = [{
			name: "Name",
			value: `\`#${event.name}\``,
			inline: true
		}];

		event.parent && fields.push({
			name: "Category",
			value: `\`${event.parent.name}\``,
			inline: true
		})

		await sendAudit(guild, {
			fields,
			color: "error",
			title: "Text Channel Removed",
		})
	}

	if(event.type === "voice") {
		const fields = [{
			name: "Name",
			value: `\`${event.name}\``,
			inline: true
		}];

		event.parent && fields.push({
			name: "Category",
			value: `\`${event.parent.name}\``,
			inline: true
		})

		await sendAudit(guild, {
			fields,
			color: "error",
			title: "Voice Channel Removed",
		})
	}

	if(event.type === "category") {
		await sendAudit(guild, {
			color: "error",
			title: "Channel Category Removed",
			fields: [{
				name: "Name",
				value: `\`${event.name}\``,
				inline: true
			}]
		})
	}

}
