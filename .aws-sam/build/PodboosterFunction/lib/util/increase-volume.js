'use strict';

const lame = require('lame');
const request = require('request');
const uploadToS3 = require('./upload-to-s3');
const volume = require('pcm-volume');

module.exports = (audioInput) => {
    console.log('Inside increase-volume.js');
    return new Promise(async (resolve, reject) => {
        const audio = audioInput || {};
        const newVolume = parseFloat(process.env.VOLUME) || 1.8;
        let volumeStream = new volume();
        let decoder = new lame.Decoder();
        let encoder = new lame.Encoder({
            channels: 1,
            bitDepth: 16,
            sampleRate: 44100,
            bitRate: 64,
            outSampleRate: 44100,
            mode: lame.MONO
        });

        console.time(audio.filename);

        // Perform a GET request to get the original audio stream
        const originalStream = await request(audio.url)
            .on('error', (err) => {
                console.error(err);
                reject(err);
            })
            .on('response', (response) => {
                console.log(response.statusCode);
                console.log(response.headers);
            });

        // Set the volume to 180% of it's original volume
        volumeStream.setVolume(newVolume);

        // Decode the mp3 to pcm, apply the new volume, encode back to mp3
        originalStream.pipe(decoder);
        decoder.pipe(volumeStream);
        volumeStream.pipe(encoder);

        // Upload the transcoded file to s3
        uploadToS3(encoder, `audio/${audio.filename}`)
            .then(() => {
                console.log('Finished processing...');
                console.timeEnd(audio.filename);
                audio.stream = encoder;
                resolve(audio);
            })
            .catch(err => {
                console.error('Inside catch of uploadToS3', err);
                reject(err)
            });
    });
}
