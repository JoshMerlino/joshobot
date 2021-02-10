module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("dox", ...arguments);
		this.register("Look up an IP Address. 📍", HelpSection.MISCELLANEOUS, [{
			argument: "IP Address",
			required: true,
		}]);
	}

	async onCommand({ args, sender, channel, guildConfig }) {

		// Parse arguments
		const [ query ] = args;

		// Look up ip address
		const details = await fetch(`https://joshm.us.to/api/iputils/v1/lookup?query=${query}`).then(resp => resp.json());

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle(`Geolocation for: ${query}`);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If bad request
		if(details.success === false) {
			embed.setColor(guildConfig.theme.error);
			embed.setDescription(details.error);
			return await channel.send(embed);
		}

		// If successful
		embed.setColor(guildConfig.theme.info);
		embed.setURL(details.mapUrl);
		embed.addField("Location", `${details.city} ${details.region}, ${details.zip}, ${details.country}`);
		embed.addField("Lat & Lon", `${details.lat}, ${details.lon}`, true);
		embed.addField("Timezone", details.timezone, true);
		embed.addField("Internet Service Provider", details.org, true);

		return await channel.send(embed);

	}

}
