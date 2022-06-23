import * as youtubedl from 'yt-dlp-exec';

// eslint-disable-next-line prettier/prettier
export const determineUrl = (url: string): 'youtubeShorts' | 'unknown' => {
  const youtubeShortRegex =
    // eslint-disable-next-line no-irregular-whitespace
    /http(?:s?):\/\/(?:www\.)?youtube\.com\/shorts\/([\w\-_]*)(\?feature=share)/g;

  if (youtubeShortRegex.test(url)) {
    return 'youtubeShorts';
  }

  return 'unknown';
};

// eslint-disable-next-line prettier/prettier
export const downloadVideo = async (url: string): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${randomString}`;

    youtubedl
      .default(url, {
        referer: url,
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
