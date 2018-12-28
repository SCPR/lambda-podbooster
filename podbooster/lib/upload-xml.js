'use strict';

const cheerio = require('cheerio');
const deleteFromS3 = require('./util/delete-from-s3');
const uploadToS3 = require('./util/upload-to-s3');

module.exports = (podcastData) => {
    return new Promise((resolve, reject) => {
        // Resolve out of this promise immediately if there are no changes detected
        if (podcastData.inclusionList.length === 0) {
            return resolve(podcastData, 'No changes detected');
        }

        // Load the xml into the parsing api
        const $ = cheerio.load(podcastData.xmlBody, { xmlMode: true });

        // Update the urls for each of the audio files
        podcastData.activeList.forEach((audio) => {
            const enclosureElement = $('enclosure').get(audio.index);
            $(enclosureElement).attr('url', process.env.S3_HOSTED_URL_BASE + audio.filename);
        });

        // Upload the updated xml
        const xmlRequestBody = $.xml();
        uploadToS3(xmlRequestBody, 'index.xml')
            .then(() => {
                // Delete stale audio files
                if (podcastData.exclusionList.length > 0) {
                    deleteFromS3(podcastData.exclusionList)
                        .then(() => resolve(podcastData))
                        .catch(err => reject(err));
                } else {
                    // Pass the podcast data for future callbacks
                    resolve(podcastData);
                }
            })
            .catch(err => reject(err));
    });
}
