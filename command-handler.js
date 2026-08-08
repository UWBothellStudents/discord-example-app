import { handleCommand as handleChallenge } from './commands/challenge.js';
import { handleCommand as handleTest } from './commands/test.js';
import { handleCommand as handleTestButton } from './commands/test-button.js';
import { handleCommand as handleTestModal } from './commands/test-modal.js';
import { handleCommand as handleTestSelect } from './commands/test-select.js';

const commandHandlers = [
  handleTest,
  handleTestButton,
  handleTestSelect,
  handleTestModal,
  handleChallenge,
];

/**
 * Passes an application command to each command module until one handles it.
 * Command handlers return a Discord response object, or undefined when the
 * command name does not belong to them.
 */
export function handleCommand(req, res) {
  const { name } = req.body.data;

  for (const commandHandler of commandHandlers) {
    const response = commandHandler(name, req);

    if (response) {
      return res.send(response);
    }
  }

  console.error(`unknown command: ${name}`);
  return res.status(400).json({ error: 'unknown command' });
}
