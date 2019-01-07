'use strict';

const increaseVolume = require('./util/increase-volume');

module.exports = (podcastData) => {
    return new Promise(async (resolve, reject) => {
        // Create a promise chain so that we can run increaseVolume one
        // stream at a time (or in batches if a parallelize env var is set)
        const promiseChain = podcastData
            .inclusionList
            .map(audio => increaseVolume(audio));

        await Promise.all(promiseChain)
            .then((amplifiedAudio) => {
                // After all of audio streams are boosted, pass the podcast data for xml processing
                console.log(`Amplified ${amplifiedAudio.length} audio file[s]`);
                podcastData.inclusionList = amplifiedAudio;
                resolve(podcastData);
            })
            .catch((err) => reject(err));
    });
}
