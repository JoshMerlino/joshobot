module.exports = async function(client) {

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => {

		// Get configuration for this specific guild
		const config = await (require("./ConfigurationAPI.js")(guild.id));

		// Log config to console
		console.log(config);

	})


};
