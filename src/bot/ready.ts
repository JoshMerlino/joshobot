import chalk from "chalk";
import { Client } from "discord.js";
import guild from "./guild";
import presenceManager from "./presenceManager";

export default function ready(this: Client): void {

	// Ensure that login was successful
	if (this === undefined || this === null) {
		return console.error("Error logging into Discord.");
	}

	// Log bot username
	console.info("Logged into Discord as", chalk.cyan(this.user?.tag));

	// Initialize presence
	presenceManager(this);

	// Initialize guilds
	this.guilds.cache.array().map(server => guild(server, this));
	this.on("guildCreate", server => guild(server, this));

}
