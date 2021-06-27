import { Client } from "discord.js";
import ready from "./bot/ready";

export default function bot(client: Client): void {

	client.on("ready", ready);

	client.login(process.env.BOT_TOKEN);

}
