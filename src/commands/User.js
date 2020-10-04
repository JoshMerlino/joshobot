module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("user", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild }) {

		const member = guild.member(args[0] ? args[0].replace(/[\\<>@#&!]/g, "") : sender.id);
		const { user } = member;

		const color = member.displayHexColor;
		const joined = dayjs(member.joinedAt).fromNow();
        const created = dayjs(user.createdAt).fromNow();
        const roles = member.roles._roles

        let rolesText = ""

        roles.forEach(role => {
            rolesText = rolesText + role.toString() + " "
        })

        rolesText = rolesText.split("@everyone").join("")

        let username = user.tag

        if (username.includes("*")) {
            username = "`" + user.tag + "`"
        }

		const embed = new MessageEmbed();
		embed.setFooter(sender.displayName, sender.user.displayAvatarURL());

		embed.setThumbnail(user.avatarURL({ format: "png", dynamic: true, size: 128 }))
		embed.setColor(color)
		embed.setTitle(user.tag)
		embed.setDescription(user.toString())

		embed.addField("Member User Info",
		`**Username**: \`${username}\`` +
		`\n**ID**: \`${user.id}\`` +
		`\n**Status**: \`${{ online: "🟢 Online", idle: "🌙 Idle", dnd: "⛔ Do not disturb", offline: "⚫ Offline" }[member.presence.status]}\``, true)

		embed.addField("Server User Info",
			"**Created**: `" + created.toString().toLowerCase() + "`\n" +
			"**Joined**: `" + joined.toString().toLowerCase() + "`\n" +
			"**Roles**: `" + member._roles.length + "`", true)

		if (member.presence.activities.length > 0) {
            let hasStatus = false
            let status = ""
            let hasGame = false
            let game = ""
            let hasSpotify = false
            let spotify = ""

            for (const activity of user.presence.activities) {
                if (activity.name.toLowerCase() == "custom status" && activity.state != undefined) {
                    if (hasStatus) return

                    status = "**custom status**: `" + activity.state + "`"
                    hasStatus = true
                }

                if (activity.name.toLowerCase() == "spotify") {
                    if (hasSpotify) return

                    spotify = "**Listening to**: `" + activity.details + "` by `" + activity.state  + "`"
                    hasSpotify = true
                }

                if (!hasGame && activity.name.toLowerCase() != "custom status" && activity.name.toLowerCase() != "spotify") {
                    game = "**Currently Playing**: `" + activity.name + "`"
                    hasGame = true
                }
            }

            let status1 = ""
            if (hasStatus) {
                status1 += status + "\n"
            }
            if (hasSpotify) {
                status1 += spotify + "\n"
            }
            if (hasGame) {
                status1 += game
            }
            if (hasStatus || hasSpotify || hasGame) {
                embed.addField("Activity", status1)
            }
        }

		await channel.send(embed);

	}

}
