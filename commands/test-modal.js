import { createTestModalResponse } from '../modal-handler.js';

export const command = {
  name: 'test-modal',
  description: 'Show a modal form example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

export function handleCommand(name) {
  if (name !== command.name) return;

  return createTestModalResponse();
}
