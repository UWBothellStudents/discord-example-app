import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

export const BUTTON_COMPONENT_ID = 'my_button';

export const command = {
  name: 'test-btn',
  description: 'Show a button example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

export function handleCommand() {
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
              custom_id: BUTTON_COMPONENT_ID,
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
  const userId = req.body.member?.user?.id || req.body.user?.id;

  return {
    response: {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `<@${userId}> clicked the button` },
    },
  };
}
