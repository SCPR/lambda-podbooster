'use strict';

const promiseSerial = require('promise-serial');
const increaseVolume = require('./util/increase-volume');

module.exports = (podcastData) => {
    console.log('Inside upload-audio.js');
    return new Promise(async (resolve, reject) => {
        const parallelize = parseInt(process.env.PARALLEL_PROCESSES) || 1;

        // Create a promise chain so that we can run increaseVolume one
        // stream at a time (or in batches if a parallelize env var is set)
        const promiseChain = podcastData
            .inclusionList
            .map(audio => increaseVolume.bind(this, audio));

        await promiseSerial(promiseChain, { parallelize })
            .then((amplifiedAudio) => {
                // After all of audio streams are boosted, pass the podcast data for xml processing
                console.log(`Amplified ${amplifiedAudio.length} audio file[s]`);
                podcastData.inclusionList = amplifiedAudio;
                resolve(podcastData);
            })
            .catch((err) => {
                console.log(err);
                reject(err)
            });
    });
}
