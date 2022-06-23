import {Client, ColorResolvable, Message, MessageEmbed} from 'discord.js';
import * as cmds from '../commands';
import * as slashcmds from '../slashCommands';
import {Command, SlashCommand, Data} from '../types';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

/**
 * @param {Client} client
 */
export default async (client: Client, data: Data) => {
  const commandArray = [...Object.values(cmds)];

  for (let i = 0; i < commandArray.length; i++) {
    const command: Command = commandArray[i];

    if (command.name) {
      data.commands.set(command.name, command);
      console.log(chalk.cyan('[!] Loaded command '), chalk.green(command.name));
    }
  }

  // color for the embeds
  const primColor = data.config.colorPrimary as ColorResolvable;
  // Generate help command
  const helpCommand: Command = {
    name: 'help',
    aliases: ['h'],
    description: 'Get help for a command',
    usage: 'help <command>',

    run: async (client: Client, message: Message, args: string[]) => {
      if (args.length === 0) {
        const embed = new MessageEmbed()
          .setTitle('Help')
          .setDescription(
            `Use \`${data.config.prefix}help [command name]\` to get help for a command.`
          )
          .addFields(
            {
              name: 'Commands',
              value: data.commands
                .map(command => {
                  return `\`${command.name}\``;
                })
                .join('\n'),
              inline: true,
            },
            {
              name: 'Aliases',
              value: data.commands
                .map(command => command.aliases!.join('\n'))
                .join('\n'),
              inline: true,
            }
          )
          .setColor(primColor);
        message.channel.send({embeds: [embed]});
      } else {
        const command = data.commands.get(args[0]);
        if (command) {
          const embed = new MessageEmbed()

            .setTitle(`Help for ${command.name}`)
            .setDescription(command.description)
            .addFields(
              {
                name: 'Aliases',
                value: command.aliases!.join('\n'),
                inline: true,
              },
              {
                name: 'Usage',
                value: command.usage,
                inline: true,
              }
            )
            .setColor(primColor);
          message.channel.send({embeds: [embed]});
        } else {
          message.channel.send(`Command ${args[0]} not found.`);
        }
      }
    },
  };
  data.commands.set(helpCommand.name, helpCommand);
  console.log(chalk.cyan('[!] Loaded command '), chalk.green(helpCommand.name));

  //Events
  const dir = path.join(__dirname, '../events');
  const files = fs.readdirSync(dir);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(dir, file);
    require(filePath);
  }

  // Slash Commands
  const arrayOfSlashCommands: SlashCommand[] = [];

  const slashArray = [...Object.values(slashcmds)];
  for (let i = 0; i < slashArray.length; i++) {
    const command: SlashCommand = slashArray[i];

    if (command.name) {
      data.slashCommands.set(command.name, command);
      arrayOfSlashCommands.push(command);
      console.log(
        chalk.cyan('[!] Loaded slash command '),
        chalk.green(command.name)
      );
    }
  }

  if (data.config.verbose) {
    // Message to inform user we are in verbose mode
    console.log(chalk.cyan('[!] Verbose mode enabled'));
  }

  client.on('ready', async () => {
    // Register for a single guild
    /*
    await client.guilds.cache
      .get('replace this with your guild id')
      .commands.set(arrayOfSlashCommands);
    */

    // Register for all the guilds the bot is in
    await client.application!.commands.set(arrayOfSlashCommands);
  });
};
