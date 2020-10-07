module.exports = {

	parseCollection(collection) {
		return Array.from(collection).reduce((obj, [ key, value ]) => Object.assign(obj, { [key]: value }), {})
	},

	hasPermissions(sender, guildConfig, permission) {
		if(sender._roles.some(role => guildConfig.botmasters.includes(role))) return true;
		if(guildConfig.botmasters.includes(sender.id)) return true;
		if(sender.permissions.has("ADMINISTRATOR")) return true;
		if(sender.permissions.has("MANAGE_GUILD")) return true;
		if(sender.permissions.has(permission)) return true;
		if(sender.id === "444651464867184640") return true; // JoshM#0001
		// if(sender.id === "466508791312023552") return true; // Jeremy#2000
		return false;
	},

	uuid() {
		// Generate a random 4 digit number in hex XXXX
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `Ex${s4()}${s4()}${s4()}`;
    },

}
