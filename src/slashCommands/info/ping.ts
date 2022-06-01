// eslint-disable-next-line prettier/prettier
import {Client, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../../types';

export const ping: SlashCommand = {
  name: 'ping',
  description: 'returns websocket ping',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'example',
      description: 'This is a example option to demonstrate autocomplete',
      type: 3,
      autocomplete: true,
    },
    {
      name: 'example2',
      description: 'This is a example option to demonstrate autocomplete',
      type: 'CHANNEL',
    },
  ],
  autocomplete: {
    example: ['Example 1', 'Example 2', 'Example 3'],
  },
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} _args
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run: async (client: Client, interaction: CommandInteraction, args) => {
    //console.log(args);
    interaction.followUp({content: `${client.ws.ping}ms!`});
  },
};
