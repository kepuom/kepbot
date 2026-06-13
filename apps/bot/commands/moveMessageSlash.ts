import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  type ChatInputCommandInteraction,
  type TextChannel,
  bold,
} from "discord.js";
import { sendWebhookMessage } from "../handlers/sendWebhookMessage.ts";
import { createCommand } from "../lib/createCommand.ts";

export const moveMessageSlashCommand = createCommand({
  data: {
    name: "move-message-slash",
    description: "Moves a message to another channel",
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["ManageMessages", "ManageChannels"],
    options: [
      {
        name: "message-url",
        description: "Message URL to move",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "channel-id",
        description: "Channel URL to move the message to",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction, data) => {
    const messageUrl = interaction.options.getString(data.options[0].name, true);
    const targetChannelId = interaction.options.getString(data.options[1].name, true);
    const [guildId, channelId, messageId] = messageUrl.split("/").slice(-3);
    try {
      await interaction.deferReply({ ephemeral: true });
      const messageChannel = (await interaction.guild!.channels.fetch(channelId)) as TextChannel;
      const message = await messageChannel.messages.fetch(messageId);

      const { sentMessage } = await sendWebhookMessage({
        channelManager: interaction.guild!.channels,
        message,
        targetChannelId,
        user: interaction.user,
      });
      await interaction.editReply({
        content: `Message moved to https://discord.com/channels/${interaction.guild!.id}/${sentMessage.channel_id}/${sentMessage.id}`,
      });
    } catch (err) {
      console.error(err);
      console.log({ guildId, channelId, messageId });
      await interaction.editReply({
        content: `Something went wrong. Ensure you've provided the correct message ${bold("URL")} and channel ${bold("Id")}\n${err}`,
      });
    }
  },
});
