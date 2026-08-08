import { handleComponent as handleChallengeComponent } from './commands/challenge.js';
import { handleComponent as handleTestButtonComponent } from './commands/test-button.js';
import { handleComponent as handleTestSelectComponent } from './commands/test-select.js';

const componentHandlers = [
  handleTestButtonComponent,
  handleTestSelectComponent,
  handleChallengeComponent,
];

/**
 * Passes a message component interaction to each command module until one
 * handles it. A handler may include work that must run after Discord receives
 * the interaction response, such as editing the original message.
 */
export async function handleComponent(req, res) {
  const componentId = req.body.data.custom_id;

  for (const componentHandler of componentHandlers) {
    const result = componentHandler(componentId, req);

    if (result) {
      res.send(result.response);

      if (result.afterResponse) {
        try {
          await result.afterResponse();
        } catch (err) {
          console.error('Error updating component message:', err);
        }
      }

      return;
    }
  }

  console.error(`unknown component: ${componentId}`);
  return res.status(400).json({ error: 'unknown component' });
}
