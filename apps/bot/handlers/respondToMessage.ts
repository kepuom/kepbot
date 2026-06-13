import type { Message } from "discord.js";
import { getResponsesFromMention, getResponsesFromMessage } from "@kepbot/db/responses";
import { discordIds } from "../lib/discordIds.ts";

export async function respondToMessage(message: Message) {
  const { content, author, channelId } = message;
  if (author.bot) return;
  if (!message.channel.isSendable()) return;
  const { channels } = discordIds;
  const { blabla, skynet, botCommands } = channels;
  if (!([blabla, skynet, botCommands] as string[]).includes(channelId)) return;
  const savedResponses = message.mentions.has(process.env.DISCORD_CLIENT_ID as string)
    ? await getResponsesFromMention({ targetId: author.id })
    : await getResponsesFromMessage({ targetId: author.id, trigger: content });
  if (savedResponses.length === 0) return;
  const response = savedResponses[Math.floor(Math.random() * savedResponses.length)];
  await message.channel.send({
    content: response.text,
    allowedMentions: { parse: [] },
  });
}
