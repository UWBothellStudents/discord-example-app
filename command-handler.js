import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';
import { getRPSChoices } from './game.js';
import { createGame } from './game-store.js';
import { getRandomEmoji } from './utils.js';

export function handleCommand(req, res) {
  const { id, data } = req.body;
  const { name } = data;

  if (name === 'test') {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: `hello world ${getRandomEmoji()}`,
          },
        ],
      },
    });
  }

  if (name === 'test-btn') {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.IS_COMPONENTS_V2,
        components: [
          {
            type: MessageComponentTypes.TEXT_DISPLAY,
            content: 'A message with a button',
          },
          {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
              {
                type: MessageComponentTypes.BUTTON,
                custom_id: 'my_button',
                label: 'Click',
                style: ButtonStyleTypes.PRIMARY,
              },
            ],
          },
        ],
      },
    });
  }

  if (name === 'challenge' && id) {
    const context = req.body.context;
    const userId = context === 0 ? req.body.member.user.id : req.body.user.id;
    const option = data.options?.[0];

    if (!option?.value) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Please provide a move like rock, paper, or scissors.',
        },
      });
    }

    const objectName = option.value;
    const validChoices = getRPSChoices();

    if (!validChoices.includes(objectName.toLowerCase())) {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Please choose a valid move: ${validChoices.join(', ')}.`,
        },
      });
    }

    createGame(id, { id: userId, objectName });

    return res.send({
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
    });
  }

  console.error(`unknown command: ${name}`);
  return res.status(400).json({ error: 'unknown command' });
}
