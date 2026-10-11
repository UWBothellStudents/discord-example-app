// These imports allow this code to have access to handlers and IDs
import {
  ACCEPT_BUTTON_PREFIX,
  handleComponent as handleChallengeComponent,
  SELECT_CHOICE_PREFIX,
} from '../commands/challenge.js';
import {
  BUTTON_COMPONENT_ID,
  handleComponent as handleTestButtonComponent,
} from '../commands/test-button.js';
import {
  handleComponent as handleTestSelectComponent,
  SELECT_COMPONENT_ID,
} from '../commands/test-select.js';

// Create a Map to quickly get our handler by ID
const componentHandlers = {
  [BUTTON_COMPONENT_ID]: handleTestButtonComponent,
  [SELECT_COMPONENT_ID]: handleTestSelectComponent,
  [ACCEPT_BUTTON_PREFIX]: handleChallengeComponent,
  [SELECT_CHOICE_PREFIX]: handleChallengeComponent,
};

// Looks up handlers by matching IDs that match exactly or that startWith the key
function getComponentHandler(componentId) {
  const handlerKey = Object.keys(componentHandlers).find((key) =>
    componentId === key || componentId.startsWith(key)
  );

  return componentHandlers[handlerKey];
}

/**
 * Dispatch the request by ID.
 * Looks up a component handler by its exact ID or dynamic ID prefix. A handler
 * may include work that must run after Discord receives the interaction
 * response, such as editing the original message.
 */
export async function handleComponent(req, res) {
  const componentId = req.body.data.custom_id;
  const componentHandler = getComponentHandler(componentId);

  if (componentHandler) {
    const result = componentHandler(componentId, req);

    if (!result) {
      console.error(`component could not be handled: ${componentId}`);
      return res.status(400).json({ error: 'component could not be handled' });
    }

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

  console.error(`unknown component: ${componentId}`);
  return res.status(400).json({ error: 'unknown component' });
}
