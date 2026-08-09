import { command as challenge, handleCommand as handleChallenge } from '../commands/challenge.js';
import { command as test, handleCommand as handleTest } from '../commands/test.js';
import { command as testButton, handleCommand as handleTestButton } from '../commands/test-button.js';
import { command as testModal, handleCommand as handleTestModal } from '../commands/test-modal.js';
import { command as testSelect, handleCommand as handleTestSelect } from '../commands/test-select.js';

const commandHandlers = {
  [test.name]: handleTest,
  [testButton.name]: handleTestButton,
  [testSelect.name]: handleTestSelect,
  [testModal.name]: handleTestModal,
  [challenge.name]: handleChallenge,
};

/**
 * Uses the command name to look up its handler directly.
 */
export function handleCommand(req, res) {
  const { name } = req.body.data;
  const commandHandler = commandHandlers[name];

  if (commandHandler) {
    return res.send(commandHandler(req));
  }

  console.error(`unknown command: ${name}`);
  return res.status(400).json({ error: 'unknown command' });
}
