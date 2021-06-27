import chalk from "chalk";
import { Client, Guild, Message } from "discord.js";
import { resolve } from "path";
import { readFile } from "fs/promises";
import JSONStore from "filestore-json";
import asyncRequireContext from "async-require-context";
import hasPermission from "./hasPermission";
import embedTemplate from "./embedTemplate";
import Color from "./class/Color";

export default async function guild(guild: Guild, client: Client): Promise<void> {

	// Get config
	const defaultConfig: GuildConfig = JSON.parse(await readFile(resolve("./defaultConfig.json"), "utf8"));
	const config = JSONStore.from<GuildConfig>(resolve(`./guilds/${guild.id}/config.json`), defaultConfig);

	console.info("Initialized guild", chalk.cyan(guild.name), chalk.magenta(guild.id));

	// Enable all commands
	const commands = await asyncRequireContext<Command>(resolve("./lib/bot/commands"));
	commands.map(context => {

		const aliases = typeof context.module.alias === "object" ? context.module.alias : [ context.module.alias ];

		client.on("message", (message: Message) => {
			aliases.map(alias => {

				// On command
				if (message.content.split(" ")[0].toLowerCase() === config.value.prefix + alias.toLowerCase()) {

					const runnable: RunnableCommand = { ...context.module, alias, config };

					// Ensure user has permission
					if (hasPermission(guild.member(message.author)!, context.module.permission || "NONE")) {
						context.module.handler(message, runnable);
					} else {
						const embed = embedTemplate(message, runnable);
						embed.setColor(Color.ERROR);
						embed.setTitle("No permission!");
						embed.setDescription(`You are lacking the permission \`${context.module.permission}\`. Ask an administrator if you have the right roles.`);
						message.channel.send(embed);
					}

				}
			});
		});
	});

}
