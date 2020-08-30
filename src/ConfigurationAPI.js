const YAML = require("yaml");
const path = require("path");
const { promises: fs } = require("fs");

module.exports = function(guildId) {
	return new Promise(async resolve => {
		const defaultConfig = YAML.parse(await fs.readFile(path.join(APP_ROOT, "default-config.yml"), "utf8"));
		require("fs").exists(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), async exists => {
			if(exists) {
				const config = YAML.parse(await fs.readFile(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), "utf8"));
				config.guild = guildId;
				resolve(config);
			} else {
				await require("mkdirp")(path.join(APP_ROOT, "config"));
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guildId}.yml`), await fs.readFile(path.join(APP_ROOT, "default-config.yml")), "utf8");
				const config = defaultConfig;
				config.guild = guildId;
				resolve(config);
			}
		})
	});
};
