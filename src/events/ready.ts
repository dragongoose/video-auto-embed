import {client} from '../../index';
import chalk from 'chalk';

client.on('ready', () =>
  console.log(
    `${chalk.cyan('[!]')} ${chalk.magenta(client.user!.tag)} ${chalk.cyan(
      'is up and ready to go!'
    )}`
  )
);
