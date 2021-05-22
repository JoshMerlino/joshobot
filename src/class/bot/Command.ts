import Runtime from "./Runtime";

export default class Command {

	aliases: string[] | string = [];

	description = "";

	runtime: Runtime;

	constructor(runtime: Runtime) {
		this.runtime = runtime;
	}

}

