'use strict';

const lame = require('lame');
const request = require('request');
const uploadToS3 = require('./upload-to-s3');
const volume = require('pcm-volume');

module.exports = (audioInput) => {
    return new Promise(async (resolve, reject) => {
        const audio = audioInput || {};
        const newVolume = parseFloat(process.env.VOLUME) || 1.8;
        let volumeStream = new volume();
        let decoder = new lame.Decoder();

        // Set the volume to 180% of it's original volume
        volumeStream.setVolume(newVolume);

        // GET the original audio stream
        const originalStream = request(audio.url)
            .on('error', (err) =>reject(err))

        originalStream.pipe(decoder);

        decoder.on('format', (format) => {
            // Decode the mp3 to pcm, apply the new volume, encode back to mp3
            // with the correct sample rate
            const encoder = new lame.Encoder({
                channels: format.channels,
                sampleRate: format.sampleRate,
            });

            decoder.pipe(volumeStream);
            volumeStream.pipe(encoder);

            // Upload the transcoded file to s3
            uploadToS3(encoder, `audio/${audio.filename}`)
                .then(() => resolve(audio))
                .catch(err => reject(err));
        });
    });
}
