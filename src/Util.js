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
		return false;
	},

	uuid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
        return `Jx${s4()}${s4()}${s4()}`;
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

	arrayDiff(arr1, arr2) {
		return arr1.concat(arr2).filter(val => !(arr1.includes(val) && arr2.includes(val)));
	},

	async writeConfig(guild_id) {
		await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild_id}.yml`), YAML.stringify(config[guild_id]), "utf8");
	},

	async getMuteRole(guild) {
		// Find a mute role or generate one if one wasnt found
		let muterole = config[guild.id].commands["mute"].muterole;
		if(!Object.keys(util.parseCollection(guild.roles.cache)).includes(muterole)) muterole = null
		if(Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`).length > 0) muterole = Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`)[0].id
		if(!muterole) muterole = (await guild.roles.create({ data: { color: guildConfig.theme.dunce, name: `Muted (Josh O' Bot)` }, reason: "Create a role for muted users - Josh O' Bot" })).id;

		// Ensure role is saved
		config[guild.id].commands.mute.muterole = muterole;
		await util.writeConfig(guild.id);

		// Configure all channels to deny sending
		const role = await guild.roles.fetch(muterole);
		Object.values(util.parseCollection(guild.channels.cache)).map(async ch => {
			if(channel.permissionsLocked !== true) {
				await ch.updateOverwrite(role, {
					SEND_MESSAGES: false,
					EMBED_LINKS: false,
					ATTACH_FILES: false,
				})
			}
		});

		return role;
	}

}
