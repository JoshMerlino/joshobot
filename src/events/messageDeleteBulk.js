module.exports = async function(guild, [ event ]) {
	const messages = Object.values(util.parseCollection(event));

	const fields = [];

	fields.push({
		name: "Amount",
		value: `${messages.length} Total Messages`,
		inline: true
	})

	const users = {};
	messages.map(msg => users.hasOwnProperty(msg.author.id) ? users[msg.author.id]++ : users[msg.author.id] = 1);

	fields.push({
		name: "By User",
		value: Object.keys(users).map(user => `<@${user}>: ${users[user]} Messages`).join("\n"),
		inline: true
	})

	if(fields.length === 0) return;

	await sendAudit(guild, {
		fields,
		color: "severe",
		title:  "Messages Purged",
	})

}
