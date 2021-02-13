module.exports = {

	parseCollection(collection) {
		return Array.from(collection).reduce((obj, [ key, value ]) => Object.assign(obj, { [key]: value }), {})
	},

	hasPermissions(sender, guildConfig, permission) {
		if(sender._roles.some(role => guildConfig.botmasters.includes(role))) return true;
		if(guildConfig.botmasters.includes(sender.id)) return true;
		if(sender.permissions.has("ADMINISTRATOR")) return true;
		if(sender.permissions.has("MANAGE_GUILD")) return true;
		if(sender.permissions.has(permission)) return true;
		if(sender.id === "444651464867184640") return true; // JoshM#0001
		return false;
	},

	uuid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
        return `Jx${s4()}${s4()}${s4()}`;
    },

	user(user, guild) {
		return guild.member(typeof user === "string" ? user.replace(/[\\<>@#&!]/g, "") : user.id);
	},

	channel(channel, guild) {
		return guild.channels.resolve(typeof channel === "string" ? channel.replace(/[\\<>@#&!]/g, "") : channel.id);
	},

	role(role, guild) {
		return role.match(/<@&([0-9]*)>/g) ? guild.roles.fetch(role.replace(/[\\<>@#&!]/g, "")) : guild.roles.fetch(Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name.toLowerCase().replace(/\s/g, "-") === role.toLowerCase())[0].id)
	},

	ts(timestamp) {
		const time = dayjs(timestamp);
		return `${time.format("MMMM DD, YYYY")}`
	},

	arrayDiff(arr1, arr2) {
		return arr1.concat(arr2).filter(val => !(arr1.includes(val) && arr2.includes(val)));
	},

	async writeConfig(guild_id) {
		await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild_id}.yml`), YAML.stringify(config[guild_id]), "utf8");
	},

	async getMuteRole(guild) {

		// Find a mute role or generate one if one wasnt found
		let muterole = config[guild.id].commands["mute"].muterole;
		if(!Object.keys(util.parseCollection(guild.roles.cache)).includes(muterole)) muterole = null
		if(Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`).length > 0) muterole = Object.values(util.parseCollection(guild.roles.cache)).filter(r => r.name === `Muted (Josh O' Bot)`)[0].id
		if(!muterole) muterole = (await guild.roles.create({ data: { color: Color.dunce, name: `Muted (Josh O' Bot)` }, reason: "Create a role for muted users - Josh O' Bot" })).id;

		// Ensure role is saved
		config[guild.id].commands.mute.muterole = muterole;
		await util.writeConfig(guild.id);

		// Configure all channels to deny sending
		const role = await guild.roles.fetch(muterole);
		Object.values(util.parseCollection(guild.channels.cache)).map(async channel => {
			if(channel.permissionsLocked !== true) {
				await channel.updateOverwrite(role, {
					SEND_MESSAGES: false,
					EMBED_LINKS: false,
					ATTACH_FILES: false,
				})
			}
		});

		return role;

	},

	async redditImage(post, allowed)  {

		// Get image
		let image = post.data.url;

		// If subreddit contains an imgur link
		if(image.includes("imgur.com/a/")) {
			post = allowed[Math.floor(Math.random() * allowed.length)];
			image = post.data.url;
		}

		// If is not an imgur gif
		if(image.includes("imgur") && !image.includes("gif")) {
			image = "https://i.imgur.com/" + image.split("/")[3];
			if(!isImageUrl(image)) image = "https://i.imgur.com/" + image.split("/")[3] + ".gif";
			return [ image, post.data.title, post.data.permalink, post.data.author ];
		}

		// Get gfycat image
		if(image.includes("gfycat")) {

			// Api request
			const link = await fetch("https://api.gfycat.com/v1/gfycats/" + image.split("/")[3]).then(url => url.json());

			// If theres a gif
			if(link.gfyItem) {
				image = link.gfyItem.max5mbGif;
				return [ image, post.data.title, post.data.permalink, post.data.author ];
			}

		}

		// Initialize count
		let count = 0

		// Iterate until an image is found
		while (!isImageUrl(image)) {

			// Set max amount of tries
			if (count >= 10) break;

			// Increment count
			count ++;

			// Get a random post and image from subreddit
			post = allowed[Math.floor(Math.random() * allowed.length)];
			image = post.data.url;

			// If is an imgur link
			if(image.includes("imgur.com/a/")) {
				post = allowed[Math.floor(Math.random() * allowed.length)];
				image = post.data.url;
			}

			// If is not a gif or png link from imgur
			if(image.includes("imgur") && !image.includes("gif") && !image.includes("png")) {
				image = "https://i.imgur.com/" + image.split("/")[3];
				image = "https://i.imgur.com/" + image.split("/")[3] + ".png";
				if(!isImageUrl(image)) {
					image = "https://i.imgur.com/" + image.split("/")[3] + ".gif";
					return [ image, post.data.title, post.data.permalink, post.data.author ];
				}
			}

			if(image.includes("gfycat")) {

				// Fetch api
				const link = await fetch("https://api.gfycat.com/v1/gfycats/" + image.split("/")[3]).then(url => url.json());

				// If successful
				if(link) {
					image = link.gfyItem.max5mbGif
					return [ image, post.data.title, post.data.permalink, post.data.author ];
				}

			}

		}

		// Return image
		return [ image, post.data.title, post.data.permalink, post.data.author ];

	}

}
