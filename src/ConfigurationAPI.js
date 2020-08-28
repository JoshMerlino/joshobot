const YAML = require("yaml");
const path = require("path");
const { promises: fs } = require("fs");

module.exports = async function(guildId) {

	// Get default configuration
	const defaultConfig = YAML.parse(await fs.readFile(path.join(APP_ROOT, "default-config.yml"), "utf8"));

	// Get guild ID for future each guild specifys their own config which will extend the defaults
	defaultConfig.guild = guildId;

	return defaultConfig;

};
