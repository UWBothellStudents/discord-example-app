import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';
import { getResult, getRPSChoices, getShuffledOptions } from '../game.js';
import { createGame, deleteGame, getGame } from '../game-store.js';
import { DiscordRequest, getRandomEmoji } from '../utils.js';

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

export function handleCommand(name, req) {
  if (name !== command.name) return;

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
              custom_id: `accept_button_${id}`,
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
  if (componentId.startsWith('accept_button_')) {
    const gameId = componentId.replace('accept_button_', '');
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

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
                  custom_id: `select_choice_${gameId}`,
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

  if (componentId.startsWith('select_choice_')) {
    const gameId = componentId.replace('select_choice_', '');
    const game = getGame(gameId);

    if (!game) return;

    const respondingUserId = req.body.member?.user?.id || req.body.user?.id;
    const objectName = req.body.data.values[0];
    const resultStr = getResult(game, {
      id: respondingUserId,
      objectName,
    });
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

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
