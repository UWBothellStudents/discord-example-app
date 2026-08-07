import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';
import { getResult, getShuffledOptions } from './game.js';
import { deleteGame, getGame } from './game-store.js';
import { DiscordRequest, getRandomEmoji } from './utils.js';

export async function handleComponent(req, res) {
  const { data } = req.body;
  const componentId = data.custom_id;
  const userId = req.body.member?.user?.id || req.body.user?.id;

  if (componentId === 'my_button') {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `<@${userId}> clicked the button` },
    });
  }

  if (componentId.startsWith('accept_button_')) {
    const gameId = componentId.replace('accept_button_', '');
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

    try {
      res.send({
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
      });
      await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err);
    }

    return;
  }

  if (componentId.startsWith('select_choice_')) {
    const gameId = componentId.replace('select_choice_', '');
    const game = getGame(gameId);

    if (game) {
      const context = req.body.context;
      const respondingUserId = context === 0 ? req.body.member.user.id : req.body.user.id;
      const objectName = data.values[0];
      const resultStr = getResult(game, {
        id: respondingUserId,
        objectName,
      });

      deleteGame(gameId);
      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

      try {
        res.send({
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
        });
        await DiscordRequest(endpoint, {
          method: 'PATCH',
          body: {
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Nice choice ${getRandomEmoji()}`,
              },
            ],
          },
        });
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  }
}
