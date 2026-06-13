import {
  ApplicationCommandType,
  type ChatInputCommandInteraction,
  type MessageContextMenuCommandInteraction,
  type UserContextMenuCommandInteraction,
} from "discord.js";
import type { BotCommand } from "../lib/createCommand.ts";
import { moveMessageCtxCommand } from "./moveMessageCtx.ts";
import { moveMessageSlashCommand } from "./moveMessageSlash.ts";
import { responsesCommand } from "./responses.ts";
import { voteMuteCommand } from "./voteMute.ts";

export const commands = [
  responsesCommand,
  moveMessageCtxCommand,
  moveMessageSlashCommand,
  voteMuteCommand,
] as unknown as BotCommand[];

export const { chatInputCommands, userCtxMenuCommands, messageCtxMenuCommands } = commands.reduce(
  (acc, command) => {
    switch (command.data.type) {
      case ApplicationCommandType.ChatInput: {
        acc.chatInputCommands.push(command as BotCommand<ChatInputCommandInteraction>);
        return acc;
      }

      case ApplicationCommandType.User: {
        acc.userCtxMenuCommands.push(command);
        return acc;
      }

      case ApplicationCommandType.Message: {
        acc.messageCtxMenuCommands.push(command);
        return acc;
      }

      default:
        return acc;
    }
  },
  {
    chatInputCommands: [],
    messageCtxMenuCommands: [],
    userCtxMenuCommands: [],
  } as {
    chatInputCommands: BotCommand<ChatInputCommandInteraction>[];
    userCtxMenuCommands: BotCommand<UserContextMenuCommandInteraction>[];
    messageCtxMenuCommands: BotCommand<MessageContextMenuCommandInteraction>[];
  },
);
