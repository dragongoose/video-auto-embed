import {Message, MessageAttachment, MessageEmbed} from 'discord.js';
import {client} from '../../index';
import {determineUrl, downloadVideo} from '../func';
import log4js from 'log4js';
import ytdl from 'ytdl-core';

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

  if (urlType === 'youtubeShorts' || urlType === 'tiktok') {
    const msg = await message.reply('Working...');
    logger.debug('getting video');

    // Convert YT short url to long url
    const newUrl = message.content.replace('shorts/', 'watch?v=');

    const video = await downloadVideo(newUrl).catch(err => {
      logger.error(err);
      msg.edit('Whoops.. something went wrong');
    });

    // use ytdl-core to get the info about the video
    const info = await ytdl.getInfo(newUrl);
    logger.debug(`info: ${JSON.stringify(info)}`);

    // get some info about the video
    const title = info.videoDetails.title;
    const author = info.videoDetails.author.name;

    // create an embed
    const embed = new MessageEmbed()
      .setTitle(title)
      .setAuthor({
        name: author,
        iconURL: info.videoDetails.author.thumbnails![0].url,
      })
      .setColor('#0099ff')
      .setDescription(
        `${info.videoDetails.likes} likes \n ${info.videoDetails.viewCount} views`
      );

    const file = new MessageAttachment(video + '/');
    msg.edit({embeds: [embed], files: [file]});

    //TODO Delete video after it's been sent
  }
});
