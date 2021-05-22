import { Message } from "discord.js";
import Runtime from "./Runtime";

export default class Command {

	aliases: string[] | string = [];

	description = "";

	runtime: Runtime;

	getAliases(): string[] {
		if (typeof this.aliases === "string") return [ this.aliases ];
		return this.aliases;
	}

	constructor(runtime: Runtime) {
		this.runtime = runtime;
	}

	onCommand(message: Message): Promise<void> | void {
		void message;
	}

}

