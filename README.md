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
