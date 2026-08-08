import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

export const command = {
  name: 'test-btn',
  description: 'Show a button example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

export function handleCommand(name) {
  if (name !== command.name) return;

  return {
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
  };
}

export function handleComponent(componentId, req) {
  if (componentId !== 'my_button') return;

  const userId = req.body.member?.user?.id || req.body.user?.id;

  return {
    response: {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `<@${userId}> clicked the button` },
    },
  };
}
