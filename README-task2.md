# Task #2: Moving From the Shared Setup to Your Own Branch, Codespace, and Bot

In Task #1 you all shared one Codespace, one bot, and one URL. That doesn't scale
once multiple people are writing code at the same time — someone's `npm start`
will stomp on someone else's, and only one Interactions Endpoint URL can be
registered at a time.

From here on:
- **Each student works on their own git branch**, in their own Codespace.
- **Each student registers their own Discord Application** (own bot, own token,
  own Interactions URL) — so you can develop and test independently without
  touching anyone else's setup.
- **Everyone's test bot lives in the same team Discord server.** You're not
  each creating a separate server. One server, multiple bots — like multiple
  test accounts sharing one workspace.
- **The Kanban board and repo stay exactly as they are.** No changes needed there.

## One-time team setup (only one person does this)

1. One teammate creates a Discord server for the team (or reuses the one
   already created in Task #1) and invites everyone else to it.
2. Share the invite link with the team (e.g., pin it in your team's chat or add
   it to the repo's README).

Everything below this point, **each student does individually**, on their own
branch.

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
Same as before — `npm install` is only needed the first time in this Codespace;
`npm start` should print `Listening on port 3000`.

**Naming tip:** if you're testing a command that already exists on a
teammate's bot (like `/test`), consider registering yours as something more
specific — e.g. rename it in `commands.js` to `/test-yourname` while you're
developing, so it's obvious in the shared server which bot's command you're
triggering. You can rename it back before merging if the team wants a shared
final command name.

## Step 6: Make your port public and set your Interactions URL

1. **Ports** tab → find port `3000` → right-click → **Port Visibility → Public**.
2. Copy the forwarded URL (`https://your-codespace-name-3000.app.github.dev`).
3. In **your** Discord Application's **General Information** page, paste the
   URL + `/interactions` into **Interactions Endpoint URL** and save.

## Step 7: Test it

In the shared team server, type `/` and find *your* bot's command in the
list (it'll be tagged with your bot's name). Confirm it responds.

You're now fully isolated from your teammates — different branch, different
Codespace, different bot, different URL. Code and test freely.

---

# Merging your work into `main`

## 1. Commit and push to your branch as you go

```bash
git add .
git commit -m "Add button interaction handler"
git push
```

## 2. Open a Pull Request

On GitHub, open a PR from your branch into `main`. Have at least one teammate
review it — this is a good moment to update the Kanban board card for the
feature you were working on (move it to "In Review").

## 3. Merge

Once approved, merge the PR into `main`. Delete the branch if your team wants
to keep things tidy (GitHub will offer this automatically after merge).

## 4. Update the "official" bot running on `main`

Merging the code doesn't automatically restart anything — a Codespace (or
whichever environment is running `main`'s code) needs to actually pick up the
new code. Whoever maintains that instance (this could be the professor, or a
designated team lead) needs to:

```bash
git checkout main
git pull
npm install        # only needed if package.json changed
npm run register    # only needed if commands.js changed
npm start            # restart to pick up code changes in app.js/utils.js
```

A few things to watch for here:
- If `commands.js` changed, you must re-run `npm run register`, or Discord's
  slash command list won't reflect the change.
- If the Codespace running `main` is ever deleted and recreated, its forwarded
  URL will change — remember to update **that** application's Interactions
  Endpoint URL in the Developer Portal, the same way you did for your personal
  bot in Step 6.
- Decide as a team who "owns" this main-branch bot and Codespace, so it's
  clear who's responsible for restarting/updating it after each merge, rather
  than assuming someone else will.

## 5. Your personal bot and Codespace

You don't need to delete your own bot, branch, or Codespace after merging —
keep them around for your next feature. Just make sure to `git pull` the
latest `main` into your branch before starting new work, so you're not
building on stale code:
```bash
git checkout main
git pull
git checkout yourname-feature
git merge main
```