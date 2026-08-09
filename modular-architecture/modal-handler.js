import {
  handleModalSubmit as handleTestModalSubmit,
  TEST_MODAL_ID,
} from '../commands/test-modal.js';

const modalHandlers = {
  [TEST_MODAL_ID]: handleTestModalSubmit,
};

/**
 * Uses the modal custom ID to look up its handler directly.
 */
export function handleModalSubmit(req, res) {
  const modalId = req.body.data.custom_id;
  const modalHandler = modalHandlers[modalId];

  if (modalHandler) {
    return res.send(modalHandler(req));
  }

  console.error(`unknown modal: ${modalId}`);
  return res.status(400).json({ error: 'unknown modal' });
}
