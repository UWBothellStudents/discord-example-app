import {
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

// These IDs connect the modal we send with the submission Discord returns.
export const TEST_MODAL_ID = 'test_modal';
const SHORT_TEXT_ID = 'my_text';
const LONG_TEXT_ID = 'my_longer_text';

export const command = {
  name: 'test-modal',
  description: 'Show a modal form example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

export function handleCommand() {
  return {
    type: InteractionResponseType.MODAL,
    data: {
      custom_id: TEST_MODAL_ID,
      title: 'Modal title',
      components: [
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: SHORT_TEXT_ID,
              style: 1,
              label: 'Type some text',
            },
          ],
        },
        {
          type: MessageComponentTypes.ACTION_ROW,
          components: [
            {
              type: MessageComponentTypes.INPUT_TEXT,
              custom_id: LONG_TEXT_ID,
              style: 2,
              label: 'Type some (longer) text',
            },
          ],
        },
      ],
    },
  };
}

export function handleModalSubmit(req) {
  const { data } = req.body;
  const userId = req.body.member?.user?.id || req.body.user?.id;
  const modalValues = data.components
    .flatMap((actionRow) => actionRow.components)
    .map((input) => `${input.custom_id}: ${input.value}`)
    .join('\n');

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `<@${userId}> typed the following (in a modal):\n\n${modalValues}`,
    },
  };
}
