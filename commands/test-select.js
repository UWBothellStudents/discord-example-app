import {
  InteractionResponseFlags,
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

export const command = {
  name: 'test-select',
  description: 'Show a select menu example',
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
          content: 'What is your object of choice?',
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.STRING_SELECT,
              custom_id: 'test_select',
              options: [
                {
                  label: 'Option #1',
                  value: 'option_1',
                  description: 'The very first option',
                },
                {
                  label: 'Second option',
                  value: 'option_2',
                  description: 'The second AND last option',
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

export function handleComponent(componentId, req) {
  if (componentId !== 'test_select') return;

  const selectedOption = req.body.data.values?.[0];
  const userId = req.body.member?.user?.id || req.body.user?.id;

  return {
    response: {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `<@${userId}> selected ${selectedOption}` },
    },
  };
}
