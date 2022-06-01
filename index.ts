import {Client, Collection} from 'discord.js';
import {config} from './config';
import {Command, SlashCommand, Config} from './src/types';

export const client = new Client({
  intents: config.intents,
});

const conf: Config = config;

export const data = {
  config: conf,
  commands: new Collection() as Collection<string, Command>,
  slashCommands: new Collection() as Collection<string, SlashCommand>,
};

// Initializing the project
import handler from './src/handler';
handler(client, data);

client.login(config.token);

// This recode of this repo took 3:10:42 to complete.
// I converted everything from JS to TS.
// I also added some comments.
// That's besides the point though.
// I was stupid, and took no brakes.
// It took ~1.5k errors.
// 158 revisions.
// A lot of confusion.
// and my sanity.
