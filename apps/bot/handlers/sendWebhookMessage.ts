import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  WebhookClient,
  type Guild,
  type GuildChannel,
  type Message,
  type User,
} from "discord.js";
import { discordIds } from "../lib/discordIds.ts";

type Props = {
  targetChannelId: GuildChannel["id"];
  channelManager: Guild["channels"];
  message: Message;
  user: User;
};

export async function sendWebhookMessage({
  message,
  channelManager,
  targetChannelId,
  user,
}: Props) {
  const { announcements, readme, rules, neaEnimerwseis, themata, lyseis, starboard } =
    discordIds.channels;
  if (
    (
      [announcements, readme, rules, neaEnimerwseis, themata, lyseis, starboard] as string[]
    ).includes(targetChannelId)
  )
    throw `MoveMessage: Target Channel ${targetChannelId} is not allowed`;
  const targetChannel = await channelManager.fetch(targetChannelId);
  if (!targetChannel) throw `MoveMessage: Channel not found with id ${targetChannelId}`;
  console.log("fetched targetChannel");

  const webhookChannel = targetChannel.isThread() ? targetChannel.parent : targetChannel;

  if (!webhookChannel) throw `MoveMessage: Channel not found with id ${targetChannelId}`;
  if (!webhookChannel.isSendable() && !webhookChannel.isThread() && !webhookChannel.isThreadOnly())
    throw `MoveMessage: Channel ${targetChannelId} is not sendable`;

  const webhook = await webhookChannel.createWebhook({
    name: `move-message-${message.author.tag}-${message.id}`,
    reason: `Move Message for ${message.author.tag}`,
    avatar: message.author.avatarURL() ?? message.author.displayAvatarURL(),
  });
  console.log("created webhook");
  const webhookClient = new WebhookClient({ url: webhook.url });
  const sourceButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setURL(message.url)
    .setLabel("Original Message");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(sourceButton);
  const sentMessage = await webhookClient.send({
    threadId: targetChannel.isThread() ? targetChannel.id : undefined,
    username: `${message.author.username} (by ${user.username})`,
    content: message.content,
    embeds: message.embeds,
    components: [...message.components, row],
    files: message.attachments.map((a) => a.url),
  });

  console.log("sent message");

  await webhook.delete();
  return { sentMessage, targetChannel };
}
