# Josh O' Bot
The all in one Discord bot!

Invite [Josh O' Bot](https://discord.com/api/oauth2/authorize?client_id=748971236276699247&permissions=8&scope=bot) to your Discord Server!

# Running the bot
ℹ To run the bot in development mode, use the following start script.

⚠ Be sure to replace `...` with the approperiate variables.
```bash
#!/bin/bash
cd "$(dirname "$0")"

export CLIENT_SECRET="..."
export RAPID_API_KEY="..."
export MODE="DEVELOPMENT"

rm config -r
npm install --save

./node_modules/.bin/nodemon .
```

# Adding Commands
1. Make sure you add keys to the `commands` section in `default-config.yml`
```yaml
new-command:
  enabled: true
  alias:
  - new-command
  - newcommand
  - nc
  - ...
```

2. Make a new file in the `src/commands` (The name of the file does not matter as long is it is a `.js` file)
3. Follow this format in the new command file
```javascript
module.exports = class Command extends require("../Command.js") {
	constructor() {
		super(/** <COMMAND CONFIGURATION SECTION> EXAMPLE: "new-command" **/, ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {
    // TODO:
	}
}
```
