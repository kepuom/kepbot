import {
  ActionRowBuilder,
  ApplicationCommandType,
  type DiscordAPIError,
  type MessageContextMenuCommandInteraction,
  ModalBuilder,
  RESTJSONErrorCodes,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { sendWebhookMessage } from "../handlers/sendWebhookMessage.ts";
import { createCommand } from "../lib/createCommand.ts";

export const moveMessageCtxCommand = createCommand({
  data: {
    name: "move-message-ctx",
    type: ApplicationCommandType.Message,
    defaultMemberPermissions: ["ManageMessages", "ManageChannels"],
  },
  execute: async (interaction: MessageContextMenuCommandInteraction) => {
    if (!interaction.guild) return;
    const message = interaction.targetMessage;
    const guildChannels = interaction.guild.channels;
    if (!guildChannels) return;

    const channelIdField = `target_channel_id`;

    const modal = new ModalBuilder({
      title: `Move Message ${message.id}`,
      custom_id: `move_message-${message.id}-by-${interaction.user.id}`,
    });
    const channelInput = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setCustomId(channelIdField)
      .setPlaceholder("Channel or Thread Id")
      .setLabel("Channel Id")
      .setRequired(true);

    const ar = new ActionRowBuilder<TextInputBuilder>().addComponents(channelInput);

    modal.addComponents(ar);

    await interaction.showModal(modal);

    const modalSubmitInteraction = await interaction.awaitModalSubmit({
      time: 30000,
    });

    await modalSubmitInteraction.deferReply({ ephemeral: true });

    const targetChannelId = modalSubmitInteraction.fields.getTextInputValue(channelIdField);

    try {
      const { sentMessage } = await sendWebhookMessage({
        channelManager: interaction.guild.channels,
        message,
        targetChannelId,
        user: interaction.user,
      });

      await modalSubmitInteraction.editReply({
        content: `Message moved to https://discord.com/channels/${interaction.guild.id}/${sentMessage.channel_id}/${sentMessage.id}`,
      });
    } catch (err) {
      await modalSubmitInteraction.editReply({ content: err!.toString() });
      if (
        // oxlint-disable-next-line eqeqeq -- idk it weird
        (err as DiscordAPIError).code == RESTJSONErrorCodes.MissingPermissions
      )
        await modalSubmitInteraction.editReply({
          content: "I am missing permissions",
        });
    }
  },
});
