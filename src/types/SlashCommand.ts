import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  Client,
  Interaction,
  Message,
} from 'discord.js';
import {AutocompleteChoices} from '.';

/**
 * A type representing a command.
 */
export interface SlashCommand {
  /**
   * The name of the command.
   * @type {string}
   */
  name: string;

  /**
   * Other names the command can be called with.
   * @type {string[]}
   */
  aliases?: string[];

  /**
   * A brief description of the command.
   * @type {string}
   */
  description: string;

  /**
   * The type of the command.
   */
  type: ApplicationCommandType;

  options: ApplicationCommandOptionData[];

  autocomplete?: AutocompleteChoices;

  /**
   * The function to run when the command is called.
   * @param {Client} client The client that the command was called on.
   * @param {Message} message The message that the command was called on.
   * @param {string[]} args The arguments passed to the command.
   * @param {Data} data The data object that contains all the data the bot has.
   * @returns {Promise<void>}
   */
  run(
    client: Client,
    message: Message | Interaction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: {[k: string]: any}
  ): Promise<void>;
}
