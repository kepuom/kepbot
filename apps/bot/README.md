# kepbot

To install dependencies:

```bash
pnpm install
```

To run:

```bash
pnpm dev
```

The bot runs TypeScript directly with Node 24 using the root `.env` file.

To manage Discord commands:

```bash
pnpm registerCommand -- --guildId=<guildId> --commandName=<commandName>
pnpm deleteCommand -- --guildId=<guildId> --commandName=<commandName>
pnpm clearCommands -- --guildId=<guildId>
```
