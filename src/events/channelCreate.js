module.exports = async function(guild, [ event ]) {

	if(event.type === "text") {
		const fields = [{
			name: "Name",
			value: `\`${event.toString()}\``,
			inline: true
		}];

		event.parent && fields.push({
			name: "Category",
			value: `\`${event.parent.name}\``,
			inline: true
		})

		await sendAudit(guild, {
			fields,
			color: "success",
			title: "Text Channel Created",
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
			color: "success",
			title: "Voice Channel Created",
		})
	}

	if(event.type === "category") {
		await sendAudit(guild, {
			color: "success",
			title: "Channel Category Created",
			fields: [{
				name: "Name",
				value: `\`${event.name}\``,
				inline: true
			}]
		})
	}

}
