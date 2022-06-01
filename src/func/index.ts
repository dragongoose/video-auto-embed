import * as youtubedl from 'yt-dlp-exec';
import {Message} from 'discord.js';
import fetch from 'node-fetch';

// eslint-disable-next-line prettier/prettier
export const determineUrl = (url: string): 'youtubeShorts' | 'youtube' | 'tiktok' | 'unknown' => {
  const tiktokRegex =
    // eslint-disable-next-line no-irregular-whitespace
    /http(?:s?):\/\/(?:www\.)?tiktok.com(\/t\/|)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?\/(\?k=\d)/;

  const youtubeRegex =
    // eslint-disable-next-line no-irregular-whitespace
    /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;

  const youtubeShortRegex =
    // eslint-disable-next-line no-irregular-whitespace
    /http(?:s?):\/\/(?:www\.)?youtube\.com\/shorts\/([\w\-_]*)(\?feature=share)/g;

  if (tiktokRegex.test(url)) {
    return 'tiktok';
  }
  if (youtubeRegex.test(url)) {
    return 'youtube';
  }
  if (youtubeShortRegex.test(url)) {
    return 'youtubeShorts';
  }

  return 'unknown';
};

// eslint-disable-next-line prettier/prettier
export const downloadVideo = async (url: string, msg: Message): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${randomString}`;

    // Use node-fetch to get the redirected tiktok URL
    const res = await fetch(url);
    const redirectedUrl = res.url;

    youtubedl
      .default(redirectedUrl, {
        referer: redirectedUrl,
        maxFilesize: '8M',
        format: 'mp4',
        output: `${__dirname}/../../videos/${fileName}.%(ext)s`,
      })
      .then(output => {
        console.log(output);
        resolve(`${__dirname}/../../videos/${fileName}.mp4`);
      })
      .catch(err => {
        reject(err);
      });
  });
};
