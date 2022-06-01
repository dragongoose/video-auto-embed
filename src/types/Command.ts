import {Client, CommandInteraction, Message} from 'discord.js';
import {Data} from './Data';

/**
 * A type representing a command.
 */
export interface Command {
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
   * The usage of the command.
   * @type {string}
   * @example
   * `!ping <argument1> <argument2> <argument3>`
   */
  usage: string;

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
    message: Message | CommandInteraction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: {[k: string]: any},
    data: Data
  ): Promise<void>;
}
