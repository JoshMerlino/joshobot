/* eslint @typescript-eslint/no-non-null-assertion: off */

import { GuildMember, Message, MessageEmbed, PermissionString } from "discord.js";
import CommandUsage, { ICommandUsageTerm } from "./CommandUsage";
import Runtime from "./Runtime";
import { Color } from "./Static";

export default class Command {

	aliases: string[] | string = [];

	get args(): string[] {
		const args = this.message!.content.split(" ");
		args.shift();
		return args;
	}

	description = "";

	message?: Message;

	permission?: PermissionString | string;

	runtime: Runtime;

	usage?: CommandUsage;

	constructor(runtime: Runtime) {
		this.runtime = runtime;
	}

	static createUsage(...args: ICommandUsageTerm[]): CommandUsage {
		const usage = new CommandUsage;
		args.map(arg => usage.push(arg));
		return usage;
	}

	getAliases(): string[] {
		if (typeof this.aliases === "string") return [ this.aliases ];
		return this.aliases;
	}

	isAuthorized(member?: GuildMember | null): boolean {

		if (member === null || member === undefined) return false;

		if (this.permission === undefined) return true;
		if (member.hasPermission(<PermissionString> this.permission)) return true;
		if (member.hasPermission("ADMINISTRATOR")) return true;

		return false;

	}

	isOperable(member: GuildMember): boolean {
		return member.roles.highest.position <= member.guild?.member(this.runtime.client.user!)!.roles.highest.position;
	}

	async noPermission(): Promise<Message> {
		const { channel } = this.message!;
		const embed = new MessageEmbed;
		embed.setColor(Color.DANGER);
		embed.setTitle("No permission!");
		embed.setDescription(`In order to run this command, you need to have the \`${this.permission}\` permission.`);
		return await channel.send(embed);
	}

	async onCommand(message: Message): Promise<void | Message> {
		this.message = message;
		if (!this.isAuthorized(message.guild?.member(message.author))) return await this.noPermission();
		return await this.run();
	}

	run(): void | Promise<void | Message> {
		throw new Error("Method not implemented.");
	}

	async sendUsage(): Promise<Message> {
		const { channel } = this.message!;
		const { key, root, usage } = this.usage!.render(this.message!.content.split(" ")[0]);
		const embed = new MessageEmbed;
		embed.setColor(Color.WARNING);
		embed.setTitle("Incorrect usage!");
		embed.addField("Command arguments:", key, true);
		embed.addField("Command usage:", `\`${root} ${usage}\``, true);
		return await channel.send(embed);
	}

}

