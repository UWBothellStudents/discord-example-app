import {
  InteractionResponseType,
  MessageComponentTypes,
} from 'discord-interactions';

// custom_id values connect the modal we send to the submission Discord returns.
// Keeping them here prevents the command and submission handlers from drifting.
const TEST_MODAL_ID = 'test_modal';
const SHORT_TEXT_ID = 'my_text';
const LONG_TEXT_ID = 'my_longer_text';

/**
 * Builds the response that tells Discord to open a modal. Discord requires each
 * text input to be wrapped in an action row.
 */
export function createTestModalResponse() {
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

/**
 * Handles the interaction Discord sends after a user submits a modal. Values
 * are nested inside action rows, mirroring the component structure above.
 */
export function handleModalSubmit(req, res) {
  const { data } = req.body;

  if (data.custom_id !== TEST_MODAL_ID) {
    console.error(`unknown modal: ${data.custom_id}`);
    return res.status(400).json({ error: 'unknown modal' });
  }

  // Server interactions contain member.user; direct-message interactions use
  // user instead. Supporting both matches the contexts registered for command.
  const userId = req.body.member?.user?.id || req.body.user?.id;
  const modalValues = data.components
    .flatMap((actionRow) => actionRow.components)
    .map((input) => `${input.custom_id}: ${input.value}`)
    .join('\n');

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `<@${userId}> typed the following (in a modal):\n\n${modalValues}`,
    },
  });
}
