import { command as challengeCommand } from './commands/challenge.js';
import { command as testCommand } from './commands/test.js';
import { command as testButtonCommand } from './commands/test-button.js';
import { command as testModalCommand } from './commands/test-modal.js';
import { command as testSelectCommand } from './commands/test-select.js';

export const ALL_COMMANDS = [
  testCommand,
  testButtonCommand,
  testSelectCommand,
  testModalCommand,
  challengeCommand,
];
