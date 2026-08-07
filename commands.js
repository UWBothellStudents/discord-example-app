const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const TEST_BUTTON_COMMAND = {
  name: 'test-btn',
  description: 'Show a button example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Registering this command makes /test-modal available in Discord. Its runtime
// behavior is implemented by command-handler.js and modal-handler.js.
const TEST_MODAL_COMMAND = {
  name: 'test-modal',
  description: 'Show a modal form example',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// for reference, see https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge a user to rock paper scissors',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'choice',
      description: 'Your move for the challenge',
      type: 3,
      required: true,
      choices: [
        { name: 'Rock', value: 'rock' },
        { name: 'Paper', value: 'paper' },
        { name: 'Scissors', value: 'scissors' },
        { name: 'Cowboy', value: 'cowboy' },
        { name: 'Virus', value: 'virus' },
        { name: 'Computer', value: 'computer' },
        { name: 'Wumpus', value: 'wumpus' },
      ],
    },
  ],
};

export const ALL_COMMANDS = [
  TEST_COMMAND,
  TEST_BUTTON_COMMAND,
  TEST_MODAL_COMMAND,
  CHALLENGE_COMMAND,
];
