import {Message, Client} from 'discord.js';
import {Command, Data} from '../../types';

export const ping: Command = {
  name: 'ping',
  aliases: ['p'],
  description: 'Ping the bot',
  usage: 'ping <anything>',

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run: async (client: Client, message: Message, args: string[], data: Data) => {
    message.channel.send(`${client.ws.ping} ws ping`);
    //console.log(args);
  },
};
