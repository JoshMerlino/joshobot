# Josh O' Bot
The all in one Discord bot!

Invite [Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot) to your Discord Server!

# Running the bot
ℹ To run the bot run `index.js`

⚠ Be sure to create a `.env` file and replace `...` with the appropriate variables.
```python
# Allow requests to own server
NODE_TLS_REJECT_UNAUTHORIZED	= 0

# Nodejs mode
MODE				= DEVELOPMENT # or "PRODUCTION"

# Secret API Keys
CLIENT_SECRET			= ...
RAPID_API_KEY			= ...
```

# Adding Commands
1. Make a new file in the `src/commands` (The name of the file does not matter as long is it is a `.js` file)
2. Follow this format in the new command file
```javascript
module.exports = class Command extends require("../Command.js") {

	constructor() {

		// Add aliases to command
		super([ "new-command" ], ...arguments);

		// Add command to help
		this.register("Command Description...", HelpSection.GENERAL /* see or create enum values in src/enum/HelpSection.js */, [{
			argument: "Argument",
			required: true,
		}]);

	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		// TODO: Create command logic...

		// Send command usage
		return await this.sendUsage(channel);

	}

}
```
