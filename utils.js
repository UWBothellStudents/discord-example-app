import 'dotenv/config';

export async function DiscordRequest(endpoint, options) {
  const url = 'https://discord.com/api/v10/' + endpoint;

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });

  if (!res.ok) {
    // Read the response as text first because infrastructure errors are not
    // necessarily JSON. A response body can only be consumed once.
    const responseText = await res.text();

    // Format JSON responses when possible, but preserve plain-text responses.
    let responseDetails = responseText;

    try {
      responseDetails = JSON.stringify(JSON.parse(responseText), null, 2);
    } catch {
      // The response was plain text or HTML, so use it unchanged.
    }

    throw new Error(
      `Discord API request failed\n` +
      `Request: ${options.method || 'GET'} ${endpoint}\n` +
      `Status: ${res.status} ${res.statusText}\n` +
      `Response: ${responseDetails || '(empty response body)'}`
    );
  }

  return res;
}

export function getRandomEmoji() {
  const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function registerGlobalCommands(commands) {
  const appId = process.env.DISCORD_APPLICATION_ID;

  if (!appId) {
    throw new Error('Missing DISCORD_APPLICATION_ID in .env');
  }

  try {
    await DiscordRequest(`applications/${appId}/commands`, {
      method: 'PUT',
      body: commands,
    });

    console.log(
      `Registered ${commands.length} command(s): ${commands.map((c) => c.name).join(', ')}`
    );
    console.log(
      'Note: global commands can take up to an hour to appear the first time.'
    );
  } catch (err) {
    console.error('Failed to register commands:', err.message);
    process.exitCode = 1;
  }
}
