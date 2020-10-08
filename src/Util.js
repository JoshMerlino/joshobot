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
		if(guildConfig.id === "708050277957238784" && sender.id === "466508791312023552") return false; // Jeremy#2000 but for every server except MMC bc nobody likes him having mod
		if(sender.id === "466508791312023552") return true; // Jeremy#2000

		return false;
	},

	uuid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `Ex${s4()}${s4()}${s4()}`;
    },

	user(user, guild) {
		return guild.member(typeof user === "String" ? user.replace(/[\\<>@#&!]/g, "") : user.id);
	},

	role(role, guild) {
		if(role.match(/<@&([0-9]*)>/g)) {
			return guild.roles.fetch(role.replace(/[\\<>@#&!]/g, ""));
		} else {
			return guild.roles.fetch(Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name.toLowerCase().replace(/\s/g, "-") === role.toLowerCase())[0].id)
		}
	},

}
