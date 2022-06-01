import {Message} from 'discord.js';
import {client} from '../../index';
import {data} from '../../index';
import chalk from 'chalk';

client.on('messageCreate', async (message: Message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(data.config.prefix)
  )
    return;

  const [cmd, ...args] = message.content
    .slice(data.config.prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    data.commands.get(cmd.toLowerCase()) ||
    data.commands.find(c => c!.aliases!.includes(cmd.toLowerCase()));

  if (!command) return;
  await command.run(client, message, args, data);

  // verbose logging
  if (data.config.verbose) {
    console.log(
      `${chalk.cyan('[!]')} ${chalk.green(message.author.tag)} ${chalk.cyan(
        'ran command'
      )} ${chalk.green(command.name)}`
    );
  }
});
