import { REST, Routes } from "discord.js";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    guildId: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

const { guildId } = values;

if (!guildId) throw "guildId is required\n Usage: pnpm clearCommands -- --guildId=<guildId>";

const rest = new REST().setToken(process.env.BOT_TOKEN as string);
const data = await rest.put(
  Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID as string, guildId),
  { body: [] },
);
console.log(data);
