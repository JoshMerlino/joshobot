import { Client } from "discord.js";

export default function presenceManager(client: Client): void {

	let presenceCount = 0;
	const presence = () => [ "?help", `${client.guilds.cache.size} Servers` ];
	client.setInterval(function() {
		client.user?.setPresence({
		    activity: {
		        name: presence()[presenceCount],
				type: "PLAYING"
		    },
		    status: "online"
		});
		presenceCount = presenceCount === presence().length - 1 ? 0 : presenceCount + 1;
	}, 5000);

}
