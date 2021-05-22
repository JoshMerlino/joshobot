/* eslint @typescript-eslint/no-var-requires: off */
/* eslint @typescript-eslint/no-non-null-assertion: off */

import chalk from "chalk";
import { Client, Guild, Message } from "discord.js";
import path from "path";
import { Config } from "../../../types";
import getCommands from "../../getCommands";
import JSONStore from "../JSONStore";
import Command from "./Command";

export default class Runtime {

	// Make this a singleton instance
	static instance = new Runtime;

	// Initialize Discord client
	client = new Client;

	commands: Command[] = [];

	// Initialize runtime
	constructor() {

		// Log into discord
		this.client.login(process.env.DISCORD_SECRET);

		// On client logint
		this.client.on("ready", () => {

			// Log successful log in.
			console.info("Logged into Discord as", chalk.cyan(this?.client?.user?.tag));

			// Run ready method on this
			this?.ready();

		});

	}

	// Get config manager
	config(guild: Guild | string): JSONStore<Config> {

		// Ensure guild is the guild id
		if (typeof guild !== "string") guild = guild.id;

		// Get default config and guild config
		const config = JSONStore.from<Config>(path.resolve(`./config/guild/${guild}.json`), require(path.resolve("./config/default.json")));

		return config;

	}

	// Method that runs when the client logs into Discord
	async ready(): Promise<void> {

		// Activate all commands
		const commands = await getCommands("./lib/src/bot/command");
		commands.map(command => this.commands.push(new command(this)));

		this.client.on("message", (message: Message) => {

			// Get the guild the message was sent in
			const { guild } = message;

			// If its a DM or something other than a guild message
			if (guild === null) return;

			// Get config from guild
			const configStore = this?.config(guild);
			const config = configStore!.value;

			// Make sure message starts with prefix
			if (!message.content.startsWith(config.prefix)) return;

			// TODO: iterate over commands and run `run` method if it matches the command.

		});

	}

}
