import { Message, MessageEmbed } from "discord.js";
import Command from "../../class/bot/Command";
import { Color } from "../../class/bot/Static";
import muteRole from "../muteRole";
import ms from "ms";

export default class extends Command {

	aliases = [ "mute", "m" ];

	description = "Mutes a member.";

	permission = "MANAGE_ROLES";

	usage = Command.createUsage(
		{ required: true, argument: "user", expects: "Member to mute" },
		{ required: false, argument: "duration", expects: "Time *(e.g. 2h)*" },
		{ required: false, argument: "reason", expects: "String" }
	);

	async run(): Promise<void | Message> {

		// Set up variables
		const { message } = this;
		const { guild, channel, author } = message!;

		// Ensure command is run in a guild
		if (guild === null) return;

		// Get guild config
		const config = this.runtime.config(guild);

		// Get arguments
		const [ __user, __duration, ...__reason ] = this.args;
		const member = guild?.member(__user) ?? message?.mentions?.members?.first();
		let duration = __duration !== undefined ? ms(__duration) : null;
		let reason = __reason.length > 0 ? __reason.join(" ") : "";

		// If no user arg send usage
		if (!member) return await this.sendUsage();

		// Fix reason if no duration is specified
		if (typeof duration !== "number") {
			reason = `${__duration} ${reason}`;
			duration = null;
		}

		// Make sure bot has permission to mute user
		if (!this.isOperable(member)) {
			const embed = new MessageEmbed;
			embed.setColor(Color.DANGER);
			embed.setTitle("No permission!");
			embed.setDescription(`${member.toString()} has a role that is higher than the ${guild?.member(this.runtime.client.user!)!.roles.highest.toString()} role.`);
			return await channel.send(embed);
		}

		// If duration is specified, queue unmute
		if (typeof duration === "number") {
			const newConfig = config.value;
			newConfig.unmuteQueue[member.id] = {
				unmuteAt: Date.now() + duration,
				mutedBy: author.id,
				reason
			};
			config.value = newConfig;
		}

		// Give member mute role.
		member.roles.add(await muteRole(guild));

		// Send success
		const embed = new MessageEmbed;
		embed.setColor(Color.SUCCESS);
		embed.setTitle(`Muted: ${member.user.tag}`);
		embed.addField("Moderator", author.toString(), true);
		if (duration !== null) embed.addField("Duration", ms(duration, { long: true }), true);
		if (reason !== "") embed.addField("Reason", reason, true);
		return await channel.send(embed);

	}

}
