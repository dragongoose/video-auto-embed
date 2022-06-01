import {ApplicationCommandOptionType} from 'discord.js';

/**
 * Options for autocomplete
 */
export interface CommandOptions {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
}
