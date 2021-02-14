module.exports = function(guildId) {

	function merge(current, updates) {
		if(current === null) return;
	    for (const key of Object.keys(updates)) {
	        if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key];
	        else merge(current[key], updates[key]);
	    }
	    return current;
	}

	return new Promise(async resolve => {
		const defaultConfig = YAML.parse(await fs.readFile(path.join(APP_ROOT, "default-config.yml"), "utf8"));
		require("fs").exists(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), async exists => {
			if(exists) {
				const config = YAML.parse(await fs.readFile(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), "utf8"));
				config.guild = guildId;
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), YAML.stringify(merge(defaultConfig, config)), "utf8");
				resolve(merge(defaultConfig, config));
			} else {
				await mkdirp(path.join(APP_ROOT, "config"));
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), YAML.stringify(defaultConfig), "utf8");
				const config = defaultConfig;
				config.guild = guildId;
				resolve(config);
			}
		})
	});

};
