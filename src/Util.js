module.exports = {

	parseCollection(collection) {
		return Array.from(collection).reduce((obj, [ key, value ]) => Object.assign(obj, { [key]: value }), {})
	},

	hasPermission(sender, guildConfig, permission) {
		if(sender._roles.some(role => guildConfig.botmasters.includes(role))) return true;
		if(guildConfig.botmasters.includes(sender.id)) return true;
		if(sender.permissions.has("ADMINISTRATOR")) return true;
		if(sender.permissions.has("MANAGE_GUILD")) return true;
		if(sender.permissions.has(permission)) return true;
		if(sender.id === "444651464867184640") return true; // JoshM#0001
		if(sender.id === "466508791312023552") return true; // Jeremy#2000
		return false;
	}

}
