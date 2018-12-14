'use strict';

const cheerio = require('cheerio');
const getAudioCollections = require('./util/get-audio-collections');
const getFilenameFromUrl = require('./util/get-filename-from-url');
const request = require('request');

module.exports = () => {
  return new Promise((resolve, reject) => {
    const feedUrl = process.env.FEED_URL;
    request(feedUrl, async (error, response, body) => {
        if (error) {
            reject(error);
        }
        if (body) {
            // Load the xml into the parsing api
            const $ = cheerio.load(body, { xmlMode: true });
            const audioFiles = [];

            // For each enclosure we find, get its index, a clean url, and a filename
            $('enclosure').each((index, element) => {
                const url = $(element).attr('url').split(/[?#]/)[0];
                const filename = getFilenameFromUrl(url);
                audioFiles.push({ filename, index, url });
            });

            // Check which audio files we need to download and which files we need to delete.
            // Store the xml data for later use.
            const podcastData = await getAudioCollections(audioFiles);
            podcastData.xmlBody = body;

            console.log(`Received ${podcastData.inclusionList.length} audio file[s]`);
            console.time('Total Time');

            resolve(podcastData);
        }
    });
  });
}
