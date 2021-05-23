import Command from "../../class/bot/Command";

export default class extends Command {

	aliases = [ "mute", "m" ];

	description = "Mutes a member.";

	permission = "MANAGE_ROLES";

	usage = Command.createUsage(
		{ required: true, argument: "user", expects: "Member to mute" },
		{ required: false, argument: "duration", expects: "Time *(e.g. 2h)*" }
	);

	async run(): Promise<void> {

		// Set up variables
		const { message } = this;

		// Get arguments
		const [ userResolvable ] = this.args;

		// Get member from user
		const member = message?.guild?.member(userResolvable) ?? message?.mentions?.members?.first();

		// If no user arg send usage
		if (!member) {
			await this.sendUsage();
			return;
		}

		// TODO: Add actual mute code, also add a function to get the muterole like in v0.

	}

}
