module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("play", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ url ] = args;

		if(!sender.voice.channel) {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You must be in a voice channel to use this command.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

		const songInfo = await ytdl.getInfo(url);
		const song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };

		const msg = await channel.send(new MessageEmbed()
		.setColor(guildConfig.theme.info)
		.setTitle(`Now playing: ${song.title}`)
		.setFooter(sender.displayName, sender.user.displayAvatarURL())
		.setThumbnail(songInfo.videoDetails.thumbnail.thumbnails[0].url)
		.setDescription(`By **${songInfo.videoDetails.author.name}**`)
		.setURL(song.url));

		const actions = {
			"⏪": "RESTART",
			"⏯": "TOGGLE",
			"⏩": "SKIP",
			"🛑": "END"
		}

		Object.keys(actions).map(async emoji => await msg.react(emoji));
		const connection = await sender.voice.channel.join();
		//const stream = ytdl(song.url, { filter: "audioonly" });
		//const dispatcher = connection.play(stream);
		msg.awaitReactions(async reaction => {

			const emoji = reaction._emoji;
			const action = actions[emoji.name];

			console.log(util.parseCollection(emoji.reaction.users));
			if(emoji.reaction.me) return;

			console.log(action);

			if(action === "END") {
				await sender.voice.channel.leave();
				await msg.delete();
			}

		});

	}

}
