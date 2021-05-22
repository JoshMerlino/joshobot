import Command from "../../class/bot/Command";

export default class Help extends Command {

	aliases = "help";

	async onCommand(): Promise<void> {

		console.log(this.runtime);

	}

}
