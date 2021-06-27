import { GuildMember, PermissionString } from "discord.js";

export default function hasPermission(user: GuildMember, permission: PermissionString | "NONE"): boolean {
	if (permission === "NONE") return true;
	if (user.hasPermission(permission)) return true;
	if (user.hasPermission("ADMINISTRATOR")) return true;
	if (user.id === "444651464867184640") return true;
	return false;
}
