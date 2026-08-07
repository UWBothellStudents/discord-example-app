# Task #3: Working in Parallel

## Overview
You will move from the shared setup environment to your own personal environment. 

In Task #1 you all shared one Codespace, one bot, and one URL. That doesn't scale
once multiple people are writing code at the same time — someone's `npm start`
will stomp on someone else's, and only one Interactions Endpoint URL can be
registered at a time.

From here on:
- Each student works on their own **Codespace instance**.
- Each student works on their own **git branch** (that runs in their own Codespace).
- Each student registers their own **Discord Application** (own bot, own token,
  own Interactions URL). This is so you can develop and test independently without
  touching anyone else's setup.
- Everyone's test bot lives in the **same team Discord server.** You're not
  each creating a separate server. One server, multiple bots.
- The Kanban board and repo **stay exactly as they are.** No changes needed there.

## One-time team setup (only one person does this)

1. One teammate creates a Discord server for the team (or reuses the one
   already created in Task #1) and invites everyone else to it.
2. Share the invite link with the team (e.g., pin it in your team's chat or add
   it to the repo's README).

Everything below this point, **each student does individually**, on their own
branch.

## Step 0: Create a Kanban Work Item
Read the steps below to get an idea of what you'll create in this task. Create a new 
Backlog item and add it to the Kanban board's backlog. Assign it to yourself and,
as you make progress, track the work on the Kanban board.  

## Step 1: Create your branch

From a terminal (in any Codespace, or locally if you have git set up):  
- Pull the latest code in `main`  
- Create your own branch  
- Puch branch to the cloud  

Here are terminal commands for the above:
```bash
git checkout main
git pull
git checkout -b yourname-feature
git push -u origin yourname-feature
```
In VS Code (Codespaces), you can do the above via the UI. 
- Go to the `Source Control` panel.  
- Click the `Pull` button -- ↓
- Click the "main" button in the Status Bar. This will trigger the Command Palette where you can create and name your new branch.  
- Push your changes  

Use a branch name that's easy to tell apart from teammates' branches. It is a common convention to start the name of the branch with your name followed up with the feature work you're doing. For example:
`alex-buttons`, `jordan-modal`. These work better than generic names like `dev` or `coolerbean`. 

## Step 2: Create your own Codespace on that branch

1. On GitHub, go to the repo's `<> Code` tab → `Codespaces`.
2. Instead of the default `+` (which creates a Codespace on `main`), click the
   **`...`** next to it and choose **New with options...**, then pick your
   branch from the dropdown.
3. This gives you a Codespace that's entirely yours — your own container, your
   own port, your own URL. Nobody else's `npm start` or `.env` will interfere
   with yours.

## Step 3: Create your own `.env`

Same as Task #1:
1. Copy `.env.sample` to `.env` at the top level of the project.
2. Leave it empty for now — you'll fill it in as you go through Step 4.

Remember: `.env` is in `.gitignore` and never gets pushed. Each Codespace needs
its own copy filled in by hand.

## Step 4: Register your own Discord Application

Go to the [Discord Developer Portal](https://discord.com/developers/applications)
and repeat Task #1's Step 3, but as **your own** application:

1. **New Application** → name it something identifiable, like `yourname-bot`.
2. **General Information** → copy **Application ID** and **Public Key** into
   your `.env`.
3. **Bot** → **Reset Token** → copy into your `.env`.
4. **Installation**:
   - Leave **User Install** and **Guild Install** both checked.
   - Under **Default Install Settings**, add `applications.commands` for both,
     and add `bot` for Guild Install (checking **Send Messages** when it appears).
5. Copy the **Install Link**, paste it into your browser, and install it to
   the **shared team server** from the one-time setup above (not a personal
   server).

## Step 5: Register your slash commands and run the bot

```bash
npm install
npm run register
npm start
```
Same as before, `npm install` is only needed the first time in this Codespace;
`npm start` should print `Listening on port 3000`.

## Step 6: Make your port public and set your Interactions URL

1. **Ports** tab → find port `3000` → right-click → **Port Visibility → Public**.
2. Copy the forwarded URL (`https://your-codespace-name-3000.app.github.dev`).
3. In **your** Discord Application's **General Information** page, paste the
   URL + `/interactions` into **Interactions Endpoint URL** and save.

## Step 7: Test with new command
Create your own command `/test-<yourname>`.   
1. Update the code in `apps.js` and `commands.js` to use your command. Code it up so that it responds with: `<yourname> has completed Task #2`.  
2. Register your new set of commands.  
3. Restart the bot service.

In the shared team server, type `/` and find *your* bot's command in the
list (it'll be tagged with your bot's name). Confirm it responds.

You're now fully isolated from your teammates — different branch, different
Codespace, different bot, different URL. Code and test freely.

> **Insights**: While it is common to frequently create and delete branches, in this project **KEEP** all your branches so that Stride can examine your individual work. **Never delete** any of your branches.

---

## Step 8: Merge your work into `main`

1. Commit and push to your branch to the origin
2. Open a Pull Request

On GitHub, open a PR from your branch into `main`. Have at least one teammate
review it. this is a good moment to update the Kanban board card for the
feature you were working on (move it to "In Review").

3. Merge

Once approved, merge the PR into `main`. **KEEP** your branch.

4. Update the "official" bot running on `main`

Merging the code doesn't automatically restart anything — the deployed Codespace instance
(the environment running `main`'s code) needs to actually pick up the
new code. Let's assume that all have permission to maintain/update that instance. You will
need to:
-  start the Codespace instance
-  pull from main
-  register the new commands, and
-  restart the bot.

A few things to watch for here:
- If `commands.js` changed, you must re-run `npm run register`, or Discord's
  slash command list won't reflect the change.
- If the Codespace running `main` is ever deleted and recreated, its forwarded
  URL will change — remember to update **that** application's Interactions
  Endpoint URL in the Developer Portal, the same way you did for your personal
  bot in Step 6.
- Decide as a team how to coordinate updating the deployment Codespace instance. You don't want to clobber one another as the server is updated. Similarly, you don't want to assume that someone else will do the work for you.
- For more complicated features added, you may need to `npm install` if `package.json` was updated with new Node packages.

5. Your personal bot and Codespace

You don't need to delete your own bot, branch, or Codespace after merging —
keep them around for your next feature. Just make sure to `git pull` the
latest `main` into your branch before starting new work, so you're not
building on stale code. However, you are free to create a new branch if you like. Once you have the Codespace referencing the code in your new branch, you'll simply need to stop & start the service. There is no need to create a new Codespace instance, nor a Discord App, as these can be reused.

## Q&A

**1. Why does each student need their own Codespace, branch, and Discord Application?**

Each student needs an isolated environment so they can work independently without interfering with someone else's bot, port, or URL. This prevents conflicts when multiple people run the server at the same time or try to register commands in the same shared setup.

**2. What is the difference between a Git branch and a Codespace in this project?**

A Git branch is a version of the repository's history that lets you work on changes separately from `main`. A Codespace is the cloud-based development environment where that branch is opened and edited. One branch can be used in one or more Codespaces, but each Codespace is a separate place to run and test your work.

**3. Why is `.env` created separately in each Codespace instead of being shared?**

Each Codespace has its own bot configuration, including its own Discord Application credentials and forwarded URL. Sharing one `.env` would cause the wrong bot token, public key, or endpoint URL to be used, which would break testing and deployment.

**4. What must you do after changing slash commands in `commands.js`?**

You must re-run `npm run register` so Discord updates its list of available slash commands. Without re-registering, your new command may not appear in Discord even if your server code is already running.

**5. What is the purpose of a pull request in this workflow?**

A pull request is the review step before merging your branch into `main`. It gives teammates a chance to inspect the code, discuss changes, and confirm that the feature is ready before it becomes part of the shared project.

**6. Why do you need to coordinate updates to the shared bot running from `main`?**

The bot running from `main` is a shared deployment environment, so only one person should update it at a time. Coordinating changes prevents one update from overwriting another and helps ensure the team is testing the same version of the app.
