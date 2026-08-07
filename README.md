# Discord Bot Starter (JavaScript)

A minimal Discord bot built with Discord's **HTTP
Interactions** model, developed in **GitHub
Codespaces**. This mirrors [Discord's official quick-start
guide](https://docs.discord.com/developers/quick-start/getting-started),
but swaps their local-machine + ngrok setup for a Codespace for simplicity.

## The mental model, in plain terms

- **Discord's servers** are where a person types slash commands such as `/test` in a channel.
- Discord doesn't run your code for you. Instead it sends an **HTTP request** to a the `bot` using a URL you provide, and waits for your code to respond. 
   - This may be different from bots you may have seen elsewhere that stay constantly connected over a websocket (the "gateway" model). We are using a stateless request/response model, like a tiny website.  
   - This means your bot only works **while your server is running** and its URL is reachable via a `public` port. If you stop the app or close the Codespace, `/test` will fail until you start the bot again.
- **discord-interactions** (the npm package this project uses) handles the security handshake for you: verifying that a request really came from Discord, and answering Discord's periodic "are you alive?" (`PING`) check.

## Project structure
Below is a basic overview of the project structure:

```
├── .vscode
|   └──  launch.json  -> Lets you press F5 in VS Code to run the bot with the debugger attached
├── examples    -> Folder with more features.
|   └── <see table below>
├── .env.sample -> sample .env file
├── app.js      -> The Express server that receives and answers Discord interactions
├── commands.js -> Defines what slash commands exist 
├── utils.js    -> utility functions 
├── package.json -> the manifest file for a Node.js project      
├── README.md
└── .gitignore
```

| Examples File | Description |
| --- | --- |
| app.js | A full interactive Discord example that handles commands, buttons, and select menus for a rock-paper-scissors-style game. |
| button.js | A simple example that sends a message with a clickable button and responds when the button is pressed. |
| command.js | A minimal example that registers and responds to a slash command. |
| game.js | Contains the rock-paper-scissors game logic and helper functions for determining outcomes. |
| modal.js | Demonstrates how to show a popup and process the data submitted by the user. |
| selectMenu.js | Shows how to create a select menu and respond to the option a user chooses. |
| utils.js | Provides shared helper functions for Discord API requests, emoji selection, and string capitalization. |

## Task #1 Steps
This will help you setup your environment with sample code.  

### 0. Create Discord Server
1. Create a Discord account by going to [Discord](https://discord.com).  
   - If you already have an account, you can go to:  https://discord.com/channels/@me  
2. Create your own "Server" by click on the `+` button in the left nav to "Add a server". Make it for your friends only.   

### 2. Create `.env` on Codespaces  
We need to open the repo on Codespaces...  
1. On the GitHub site, open your Git repo.  If needed, select `<> Code` in the navigation bar.  
2. In the body of the page, select `<> Code` and select the `Codespaced` tab.  
3. Select the `+` to create a Codespace on main.  

> **VS Code client**: It should be possible to do this in the VS Code local client, but in Stride's first attempt, the VS Code client would not allow a public port. For those interested in trying...  
> *  In VS Code, install the **GitHub Codespaces** extension if you don't have it.  
> * Command Palette (`Cmd/Ctrl+Shift+P`) → **Codespaces: Create New Codespace** → pick this repo/branch. VS Code will connect to it like a remote window.  

Now create the `.env` file... 
1. At the top-level (same level as .env.sample), create the file `.env`.  
2. Copy the contents of `.env.sample` into `.env`  
   - Note: If you are working in VS Code client and have the extension `Dotenv Official + Vault` installed and functioning, then your *secrets* will be "redacted" with black boxes. To disable it, take note of the small grey text at the top: *"Toggle auto-cloaking"*.  

> **Important**: The `.env` file is added to the `.gitignore` file and will **not** be added to the Git repro. It is important to NOT add this file to the repo because it contains *secrets*.  

### 3. Create a Discord Application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) → **New Application**, give it a name.
2. On **General Information**, copy the values for **Application ID** and **Public Key** and add them to `.env`.
3. Go to **Bot** (left sidebar) → **Reset Token** → copy it to `.env` -- Discord won't show it to you again.
4. Go to **Installation** (left sidebar):
   - Under **Installation Contexts**, leave both **User Install** and **Guild Install** checked.
   - Under **Default Install Settings**:
      - add scope `applications.commands` for both
      - add scope `bot` for Guild Install. When `bot` appears, also check the **Send Messages** permission.
      - This actually adds a bot user to the server's member list, giving your code a presence that can send messages, react, join voice channels, etc. The scopes `applications.commands` and `bot` are the bare minimum for a Guild Install.  

![Create Discord Application](resources/create_discord_application.png)  

5. **Install the bot**:  
   - Copy the **Install Link** shown on the Installation page.  
   - Paste it into your browser, hit enter, and choose **Add to Server** to install the bot to your personal test server.  

![Copy Install Link](resources/discord_install_link.png)  

### 4.  Register your slash commands
Open a Terminal window and type in these two commands.
```bash
npm install
npm run register
```
The `npm install` should be required only when creating the Codespace instance this first time. Stopping and restarting the same Codespace won't require you to repeat the command.

The entire container is persisted, so if you enter the same codespace again, all your files will be there, including the `node_modules` folder. The node_modules folder contains all the modules needed to run your project and will persist even though the files are not checked into the repo. It's just a folder on the remote disk. You can stop and restart a Codespace without losing the changes that you make to your project. So as long as you're reopening the same Codespace (via "Resume codespace" or from github.com/codespaces), your installed packages will still be there.

The `npm run register` command should result in the following terminal output: 
```
Registered 1 command(s): test.
Global commands can take up to an hour to show up the first time.
```

### 5. Run the bot
```bash
npm start
```
The above commend should output:  `Listening on port 3000`.  

> Note: In the VS Code client, you should be able to press **F5** to run the bot with the debugger attached. Breakpoints will work!  

### 6. Make the port reachable and copy the URL
1. Open the **Ports** tab at the bottom of VS Code. Port `3000` should already be listed. It will likely be set to `private`. 
2. Right-click → **Port Visibility → Public**  

![Public port context menu](resources/discord_public_port.png)  

If the menu option is not available, it is because there are policies or restrictions on your environment that prevent it. In that case, may need to use a public tunnel such as **ngrok** or **Cloudflare Tunnel**. 

A private port will not work because Discord needs access to the bot. 

The URL should look something like:
```
https://your-codespace-name-3000.app.github.dev
```

3. **Test the URL** by pasting it into the browser (or you can Ctrl+click the URL in the Ports window). You should get a response that looks like:
```
Discord bot is running. Use /interactions for Discord callbacks.
```

### 7. Tell Discord where to send interactions
1. Go back to the [Discord Developer Portal](https://discord.com/developers/applications), and go to **General Information**  
2. Paste your URL **followed by `/interactions`** into the **Interactions Endpoint URL** field:
```
https://your-codespace-name-3000.app.github.dev/interactions
```

3. Click **Save Changes**. Discord immediately sends a test `PING` — if `app.js` is running, this succeeds automatically (handled by `verifyKeyMiddleware`). If it fails, confirm the app is running and the port is public, then try saving again.  

### 8. Test it
You may need to refresh your Discord site, or just wait a bit. Make sure that you have the Codespaces bot running (listening on port 3000).   

In your Discord test server, type `/test`. The bot should reply "hello world 👋". The emoji will be random.   

### 9. GitHub Settings
If you created the Git project via GitHub Classroom, and you added team members from there, then the permissions should be good-to-go. However, if for whatever reason, this is not the case, then you need to make sure that the professor and all team members have Write access to the repo.  

### 10. Project Kanban Board
1. Go to GitHub and find `Projects` in the navigation bar. 
2. Create a new project, and use the `Kanban` template. 
3. Create a new placeholder feature in the Backlog of your Kanban board.  

![Kanban Board](resources/discord_kanban_project.png)  


## Adding your own commands
1. Add a new command object to `ALL_COMMANDS` in `commands.js`, then re-run `npm run register`.
2. Add a matching `if (name === '...')` branch inside the `/interactions` handler in `app.js`.
3. Restart the server (or just let `npm run dev` auto-restart it on save).

## Troubleshooting
- **Interactions Endpoint URL won't save** → the app isn't running, or the port isn't public. Check both.
- **401 / invalid signature errors** → double-check `DISCORD_PUBLIC_KEY` in `.env` matches the Developer Portal exactly, and make sure no other middleware (like `express.json()`) runs before `verifyKeyMiddleware` on the `/interactions` route.
- **Command doesn't show up in Discord** → global commands can take up to an hour on first registration; register to a single guild for near-instant testing (see the commented note in `register-commands.js`).
- **Bot stopped responding after a while** → your Codespace probably went idle/stopped. Reopen it and run `npm start` again.

## Next steps for learning more
- Add more commands by using the Examples provided in the examples folder.  
- [Interactions Overview docs](https://docs.discord.com/developers/interactions/overview) explain the security model in more depth.
- [discord-interactions-js on GitHub](https://github.com/discord/discord-interactions-js) has more usage examples.


## Examples Folder
This directory contains a basic rock-paper-scissors-style Discord app written in JavaScript, built for the [getting started guide](https://discord.com/developers/docs/getting-started).


## Applying Changes
If you changed bot behavior or code in app.js or utils.js: stop the running process and start it again.
* Locally: Ctrl+C, then run `nmp start` 
* Or, if you want auto-restarts during development: `npm run dev`
If you changed slash commands in commands.js:  `npm run register` again so Discord updates the command list.
   - Code changes: restart required (Stop with Ctrl+C. Start with `npm start`)
   - Slash command changes requires a re-register 
The bot will not magically pick up new code until the server restarts, and Discord command updates can take a little time to appear.  

