// Run with `npm run register` any time you add or change a command in
// commands.js. This is a separate, one-time step from running the server --
// this script only tells Discord which commands exist; app.js is what
// answers them when a user actually runs one.

import 'dotenv/config';
import { registerGlobalCommands } from '../utils.js';
import { ALL_COMMANDS } from './commands.js';

registerGlobalCommands(ALL_COMMANDS);
