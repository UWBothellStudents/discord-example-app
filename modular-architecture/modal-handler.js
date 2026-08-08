import { handleModalSubmit as handleTestModalSubmit } from '../commands/test-modal.js';

const modalHandlers = [
  handleTestModalSubmit,
];

/**
 * Passes a modal submission to each command module until one handles it.
 * Modal handlers return a Discord response object, or undefined when the
 * modal custom ID does not belong to them.
 */
export function handleModalSubmit(req, res) {
  const modalId = req.body.data.custom_id;

  for (const modalHandler of modalHandlers) {
    const response = modalHandler(modalId, req);

    if (response) {
      return res.send(response);
    }
  }

  console.error(`unknown modal: ${modalId}`);
  return res.status(400).json({ error: 'unknown modal' });
}
