# Task #2: Exploring Example code

## Overview
You should have a very simple Discord bot working. Now you will explore the code found the in `module-architecture` folder. The goals are:  
* Understand Discord bot coding a bit better  
* Move to a feature-based, modular organization with co-located command logic to make the bot more extensible  
* Explain and correlate design terms to specific code  

The bot will be refactored from a monolithic interaction handler into a modular, feature-based architecture. With the changes, each slash command will encapsulate (or co-locate) its command definition, command handler, component handlers, modal handlers, and command-specific state or business logic in a dedicated module (file). Central dispatchers route incoming Discord interactions to the appropriate command module.

This separation of concerns makes commands easier to understand, test, and extend independently. It also reduces coupling and minimizes merge conflicts when multiple developers work on different commands concurrently.

Useful terms for this design include:

- **Feature-based organization** — files are organized by command/feature rather than technical layer.
- **Vertical slice architecture** — each command contains the layers needed for that feature.
- **Co-location** — related definition, behavior, state, and interaction handling live together.
- **Modular architecture** — each command is a relatively independent module.
- **Centralized dispatching** — shared handlers route interactions to command modules.
- **Separation of concerns** — `app.js` handles HTTP/Discord routing while command modules handle feature behavior.
- **Reduced coupling** — commands depend less on unrelated parts of the application.
- **Improved cohesion** — closely related code is kept together.

