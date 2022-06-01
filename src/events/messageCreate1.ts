import {Message, MessageReaction, MessageAttachment} from 'discord.js';
import {client} from '../../index';
import {determineUrl, downloadVideo} from '../func';
import log4js from 'log4js';

log4js.configure({
  appenders: {messageCreate: {type: 'file', filename: 'messageCreate.log'}},
  categories: {default: {appenders: ['messageCreate'], level: 'debug'}},
});

const logger = log4js.getLogger('messageCreate');

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return logger.debug('ignoring, bot message');
  if (!message.guild) return logger.debug('ignoring, no guild');

  // check if it's a URL the bot can handle
  const urlType = determineUrl(message.content);
  logger.debug(`urlType: ${urlType}`);

  if (urlType === 'unknown') return logger.debug('ignoring, unknown url');

  if (urlType === 'youtube') {
    await message.react('🎥');
    await message.react('❌');
    logger.debug('added reactions');

    const collector = message.createReactionCollector({time: 60000});

    collector.on('collect', async (reaction: MessageReaction) => {
      switch (reaction.emoji.name) {
        case '🎥': {
          const msg = await message.reply('Downloading video...');
          logger.debug('downloading video');

          const video = await downloadVideo(message.content, msg).catch(err => {
            logger.error(err);
            msg.edit('Error downloading video');
          });

          console.log(video);

          const file = new MessageAttachment(video + '/');

          msg.edit({content: 'video', files: [file]});

          collector.stop();
          logger.debug('stopping collector');
          break;
        }

        case '❌':
          // remove of the 2 emojis
          collector.stop();
          logger.debug('stopping collector');
          break;
      }
    });

    collector.on('end', async () => {
      logger.debug('collector ended');
      await message.reactions.cache.get('🎥')!.remove();
      await message.reactions.cache.get('❌')!.remove();
      logger.debug('removed reactions');
    });
  }

  if (urlType === 'youtubeShorts' || urlType === 'tiktok') {
    const msg = await message.reply('Working...');
    logger.debug('getting video');

    // Convert YT short url to long url
    const newUrl = message.content.replace('shorts/', 'watch?v=');

    const video = await downloadVideo(newUrl, msg).catch(err => {
      logger.error(err);
      msg.edit('Whoops.. something went wrong');
    });

    const file = new MessageAttachment(video + '/');
    msg.edit({content: 'video', files: [file]});

    //TODO Delete video after it's been sent
    //TODO Send the discord attachment URL to mongodb
  }
});
