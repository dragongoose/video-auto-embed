import {Interaction} from 'discord.js';
import {client, data} from '../../index';
import chalk from 'chalk';

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply({ephemeral: false}).catch(() => {});
    const cmd = data.slashCommands.get(interaction.commandName);

    if (!cmd) {
      // verbose logging
      if (data.config.verbose) {
        console.log(
          chalk.cyan('[!]'),
          chalk.red('Unknown command '),
          chalk.green(interaction.commandName)
        );
      }

      return interaction.reply({
        content: `Command ${interaction.commandName} not found.`,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: {[k: string]: any} = {};

    for (const option of interaction.options.data) {
      // Valid options have names, so push that to the args object.
      if (option.name) {
        args[option.name] = option;
      }

      // * I'm not sure if this is necessary, but I'm keeping it here for now.
      option.options?.forEach(x => {
        if (x.value) args.x = x.value;
      });

      interaction.member =
        interaction.guild!.members.cache.get(interaction.user.id) || null;
    }

    cmd.run(client, interaction, args);

    // verbose logging
    if (data.config.verbose) {
      console.log(
        chalk.cyan('[!]'),
        chalk.green(interaction.user?.tag || 'Unknown user'),
        chalk.cyan('ran command'),
        chalk.green(cmd.name)
      );
    }
  }

  if (interaction.isContextMenu()) {
    await interaction.deferReply({ephemeral: false});
    const command = data.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction, {});

    // verbose logging
    if (data.config.verbose && command) {
      console.log(
        chalk.cyan('[!]'),
        chalk.green(interaction.user?.tag || 'Unknown user '),
        chalk.cyan('interacted with context menu '),
        chalk.green(command.name)
      );
    } else if (data.config.verbose) {
      console.log(
        chalk.cyan('[!]'),
        chalk.green(interaction.user?.tag || 'Unknown user '),
        chalk.cyan('tried to interact with context menu'),
        chalk.green(interaction.commandName)
      );
    }
  }

  // Autocomplete Handling
  if (interaction.isAutocomplete()) {
    // gets the item to get choices for
    const focusedOption = interaction.options.getFocused(true);

    // Gets the autocomplete options from command file
    let autocomplete;
    const temp = data.slashCommands.get(interaction.commandName);
    if (temp) {
      autocomplete = temp.autocomplete;
    }

    if (!autocomplete) {
      // verbose logging
      if (data.config.verbose) {
        console.log(
          chalk.cyan('[!]'),
          chalk.green(interaction.user?.tag || 'Unknown user '),
          chalk.cyan('tried to autocomplete'),
          chalk.green(interaction.commandName)
        );
      }

      return;
    }

    //Put the choices into an array
    const choices = autocomplete[focusedOption.name];

    //Make the array into a ApplicationCommandOptionChoice object
    const final = choices.map((choice: string) => ({
      name: choice,
      value: choice,
    }));

    // Send the choices to the api
    await interaction.respond(final);

    // verbose logging
    if (data.config.verbose) {
      console.log(
        chalk.cyan('[!]'),
        chalk.green(interaction.user?.tag || 'Unknown user '),
        chalk.cyan('interacted with autocomplete on command'),
        chalk.green(interaction.commandName)
      );
    }
  }
});
