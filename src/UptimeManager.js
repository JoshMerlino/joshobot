module.exports = async function(activateGuild) {

	// Iterate through each guild the bot is connected to
	client.guilds.cache.map(async guild => await activateGuild(guild));

	// On new guild, activate
	client.on("guildCreate", async guild => await activateGuild(guild));

	// On client break, restart
	client.on("shardDisconnect", async function() {
		const { exec } = require("child_process");
		if(process.env.MODE === "PRODUCTION") await exec("sudo service josh-o-bot restart");
	});

}
