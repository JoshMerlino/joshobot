module.exports = class Command extends require("../Command.js") {

	constructor() {
		super([
			"ip",
			"dox",
			"ipaddr",
			"ipaddress",
			"iplookup",
			"geoip"
		], ...arguments);
		this.register(
			"Look up an IP Address. 📍",
			HelpSection.MISCELLANEOUS,
			[{
				argument: "IP Address",
				required: true,
			}]
		);
	}

	async onCommand({ args, sender, channel }) {

		// Parse arguments
		const [ query ] = args;

		// Show typing
		channel.startTyping();

		// Look up ip address
		const details = await fetch(`http://joshm.us.to/api/iputils/v1/lookup?query=${query}`)
		  .then(resp => resp.json())
		  .finally(() => channel.stopTyping());

		// Formulate embed
		const embed = new MessageEmbed();
		embed.setTitle(`Geolocation for: ${query}`);
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		// If bad request
		if(details.success === false) {
			embed.setColor(Color.error);
			embed.setDescription(details.error);
			return await channel.send(embed);
		}

		// If successful
		embed.setColor(Color.info);
		embed.setURL(details.mapUrl);
		embed.addField("Location", `${details.city} ${details.region}, ${details.zip}, ${details.country}`);
		embed.addField("Lat & Lon", `${details.lat}, ${details.lon}`, true);
		embed.addField("Timezone", details.timezone, true);
		embed.addField("Internet Service Provider", details.org, true);

		return await channel.send(embed);

	}

}
