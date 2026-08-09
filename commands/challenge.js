import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';
import { capitalize, DiscordRequest, getRandomEmoji } from '../utils.js';

export const ACCEPT_BUTTON_PREFIX = 'accept_button_';
export const SELECT_CHOICE_PREFIX = 'select_choice_';

const activeGames = {};

const RPSChoices = {
  rock: {
    description: 'sedimentary, igneous, or perhaps even metamorphic',
    virus: 'outwaits',
    computer: 'smashes',
    scissors: 'crushes',
  },
  cowboy: {
    description: 'yeehaw~',
    scissors: 'puts away',
    wumpus: 'lassos',
    rock: 'steel-toe kicks',
  },
  scissors: {
    description: 'careful ! sharp ! edges !!',
    paper: 'cuts',
    computer: 'cuts cord of',
    virus: 'cuts DNA of',
  },
  virus: {
    description: 'genetic mutation, malware, or something inbetween',
    cowboy: 'infects',
    computer: 'corrupts',
    wumpus: 'infects',
  },
  computer: {
    description: 'beep boop beep bzzrrhggggg',
    cowboy: 'overwhelms',
    paper: 'uninstalls firmware for',
    wumpus: 'deletes assets for',
  },
  wumpus: {
    description: 'the purple Discord fella',
    paper: 'draws picture on',
    rock: 'paints cute face on',
    scissors: 'admires own reflection in',
  },
  paper: {
    description: 'versatile and iconic',
    virus: 'ignores',
    cowboy: 'gives papercut to',
    rock: 'covers',
  },
};

function getRPSChoices() {
  return Object.keys(RPSChoices);
}

function getShuffledOptions() {
  return getRPSChoices()
    .map((choice) => ({
      label: capitalize(choice),
      value: choice,
      description: RPSChoices[choice].description,
    }))
    .sort(() => Math.random() - 0.5);
}

function getResult(playerOne, playerTwo) {
  let result;

  if (RPSChoices[playerOne.objectName]?.[playerTwo.objectName]) {
    result = {
      win: playerOne,
      lose: playerTwo,
      verb: RPSChoices[playerOne.objectName][playerTwo.objectName],
    };
  } else if (RPSChoices[playerTwo.objectName]?.[playerOne.objectName]) {
    result = {
      win: playerTwo,
      lose: playerOne,
      verb: RPSChoices[playerTwo.objectName][playerOne.objectName],
    };
  } else {
    result = { win: playerOne, lose: playerTwo, verb: 'tie' };
  }

  return result.verb === 'tie'
    ? `<@${result.win.id}> and <@${result.lose.id}> draw with **${result.win.objectName}**`
    : `<@${result.win.id}>'s **${result.win.objectName}** ${result.verb} <@${result.lose.id}>'s **${result.lose.objectName}**`;
}

function createGame(gameId, game) {
  activeGames[gameId] = game;
}

function getGame(gameId) {
  return activeGames[gameId];
}

function deleteGame(gameId) {
  delete activeGames[gameId];
}

function getWebhookEndpoint(req) {
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  if (!applicationId) {
    throw new Error('Missing Discord application ID. Set DISCORD_APPLICATION_ID in your environment.');
  }

  return `webhooks/${applicationId}/${req.body.token}/messages/${req.body.message.id}`;
}

export const command = {
  name: 'challenge',
  description: 'Challenge a user to rock paper scissors',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'choice',
      description: 'Your move for the challenge',
      type: 3,
      required: true,
      choices: [
        { name: 'Rock', value: 'rock' },
        { name: 'Paper', value: 'paper' },
        { name: 'Scissors', value: 'scissors' },
        { name: 'Cowboy', value: 'cowboy' },
        { name: 'Virus', value: 'virus' },
        { name: 'Computer', value: 'computer' },
        { name: 'Wumpus', value: 'wumpus' },
      ],
    },
  ],
};

export function handleCommand(req) {
  const { id, data } = req.body;
  const userId = req.body.member?.user?.id || req.body.user?.id;
  const option = data.options?.[0];

  if (!option?.value) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: 'Please provide a move like rock, paper, or scissors.' },
    };
  }

  const objectName = option.value;
  const validChoices = getRPSChoices();

  if (!validChoices.includes(objectName.toLowerCase())) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `Please choose a valid move: ${validChoices.join(', ')}.` },
    };
  }

  createGame(id, { id: userId, objectName });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.IS_COMPONENTS_V2,
      components: [
        {
          type: MessageComponentTypes.TEXT_DISPLAY,
          content: `Rock papers scissors challenge from <@${userId}>`,
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.BUTTON,
              custom_id: `${ACCEPT_BUTTON_PREFIX}${id}`,
              label: 'Accept',
              style: ButtonStyleTypes.PRIMARY,
            },
          ],
        },
      ],
    },
  };
}

export function handleComponent(componentId, req) {
  if (componentId.startsWith(ACCEPT_BUTTON_PREFIX)) {
    const gameId = componentId.replace(ACCEPT_BUTTON_PREFIX, '');
    const endpoint = getWebhookEndpoint(req);

    return {
      response: {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.EPHEMERAL | InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: 'What is your object of choice?',
            },
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: `${SELECT_CHOICE_PREFIX}${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        },
      },
      afterResponse: () => DiscordRequest(endpoint, { method: 'DELETE' }),
    };
  }

  if (componentId.startsWith(SELECT_CHOICE_PREFIX)) {
    const gameId = componentId.replace(SELECT_CHOICE_PREFIX, '');
    const game = getGame(gameId);

    if (!game) return;

    const respondingUserId = req.body.member?.user?.id || req.body.user?.id;
    const objectName = req.body.data.values[0];
    const resultStr = getResult(game, {
      id: respondingUserId,
      objectName,
    });
    const endpoint = getWebhookEndpoint(req);

    deleteGame(gameId);

    return {
      response: {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: resultStr,
            },
          ],
        },
      },
      afterResponse: () => DiscordRequest(endpoint, {
        method: 'PATCH',
        body: {
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `Nice choice ${getRandomEmoji()}`,
            },
          ],
        },
      }),
    };
  }
}
