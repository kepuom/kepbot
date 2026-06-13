import { heading, roleMention, type Message, type TextChannel } from "discord.js";
import { discordIds } from "../lib/discordIds.ts";
import { studentEmailRegex } from "../lib/utils.ts";

export async function validateRegisteredEmail(message: Message) {
  if (!message.guild) return;
  if (message.channelId !== discordIds.channels.newMembers) return;
  if (message.author.id !== discordIds.members.emailBot) return;
  const email = message.content.split("→").at(-1)?.trim();
  if (!email) {
    const logs = (await message.guild.channels.fetch(discordIds.channels.logs)) as TextChannel;
    return logs.send({
      content: heading(`Could not resolve email from message: ${message.url}`, 2),
    });
  }
  if (!studentEmailRegex.test(email)) {
    //TODO: replace with banning
    await message.reply({
      content: roleMention(discordIds.roles.admin),

      allowedMentions: { roles: [discordIds.roles.admin] },
    });
    await message.react("🥾");
  } else {
    await message.react("✅");
  }
}
