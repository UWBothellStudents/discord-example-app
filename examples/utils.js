import 'dotenv/config';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = `${DISCORD_API_BASE}/${endpoint}`;

  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);

  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });

  // throw API errors
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

  // return original response
  return res;
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
