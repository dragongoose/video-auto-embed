import {Collection} from 'discord.js';
import {Config} from '.';
import {Command} from './Command';
import {SlashCommand} from './SlashCommand';

export interface Data {
  /**
   * The config file of the bot.
   * @type {Config}
   */
  config: Config;

  /**
   * All the bot's commands.
   * @type {Collection<string, Command>}
   */
  commands: Collection<string, Command>;

  /**
   * All the bot's slash commands.
   * @type {Collection<string, SlashCommand}
   */
  slashCommands: Collection<string, SlashCommand>;
}
