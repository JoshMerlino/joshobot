import { Guild, Role } from "discord.js";
import { Color } from "../class/bot/Static";

export default async function muteRole(guild: Guild): Promise<Role> {

	// Fetch all roles in guild
	const roles = guild.roles.cache.array();
	const muterole = roles.filter(role => role.name === "Muted (Josh O' Bot)")[0];
	if (muterole !== undefined) return muterole;

	// Create muterole
	const newrole = await guild.roles.create({
		reason: "Create a role to give to muted members.",
		data: {
			color: Color.INACTIVE,
			name: "Muted (Josh O' Bot)"
		}
	});

	// Update channel overrides
	guild.channels.cache.array().map(async channel => {
		if (channel.permissionsLocked === true) return;
		await channel.updateOverwrite(newrole, { SEND_MESSAGES: false });
	});

	return newrole;

}
