'use strict';

const lame = require('lame');
const mm = require('music-metadata');
const request = require('request');
const uploadToS3 = require('./upload-to-s3');
const volume = require('pcm-volume');

// NOTE:
// This script uses 2 passes to properly encode the file.
// The first stream acquires the sample rate.
// The second stream applies to the volume transformation and encodes
// with the sample rate aquired from the previous stream.
// This isn't ideal because it requires 2 GET requests for every audio file

// TODO: Figure out a way to get the sample rate and continue processing with the same stream.

module.exports = (audioInput) => {
    return new Promise(async (resolve, reject) => {
        const audio = audioInput || {};
        const newVolume = parseFloat(process.env.VOLUME) || 1.8;
        let volumeStream = new volume();
        let audioDecoder = new lame.Decoder();
        let metaDecoder = new lame.Decoder();

        // Set the volume to 180% of it's original volume
        volumeStream.setVolume(newVolume);

        // GET the sample rate
        request(audio.url).pipe(metaDecoder);
        const sampleRate = await mm.parseStream(metaDecoder, 'audio/mpeg')
            .then((metadata) => metadata.format.sampleRate)
            .catch(err => reject(err));

        // GET the original audio stream
        const originalStream = request(audio.url)
            .on('error', (err) =>reject(err));

        // Decode the mp3 to pcm, apply the new volume, encode back to mp3
        // with the correct sample rate
        const encoder = new lame.Encoder({
            channels: 1,
            sampleRate: sampleRate,
        });

        originalStream.pipe(audioDecoder);
        audioDecoder.pipe(volumeStream);
        volumeStream.pipe(encoder);

        // Upload the transcoded file to s3
        uploadToS3(encoder, `audio/${audio.filename}`)
            .then(() => resolve(audio))
            .catch(err => reject(err));
    });
}
