'use strict';

const s3 = require('./s3');

module.exports = (rssAudioFiles) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Delimiter: '/',
            Prefix: process.env.S3_PREFIX + 'audio/'
        }

        s3.listObjects(params, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }

            // Filter out the directory and form an array of current filenames without the prefix
            const responseFiles = data.Contents.filter((object) => object.Key !== params.Prefix);
            const currentFiles = responseFiles.map(responseFile => responseFile.Key.split(params.Prefix)[1]);

            const currentFilesDictionary = {};
            const rssAudioFilesDictionary = {};

            const staleFiles = [];
            const incomingFiles = [];

            // Create a dictionary of all current files in s3
            currentFiles.forEach(filename => {
                currentFilesDictionary[filename] = filename;
            });

            // Create a dictionary of all files in the rss feed
            rssAudioFiles.forEach(audio => {
                rssAudioFilesDictionary[audio.filename] = audio.filename;
            });

            // Collect all the incoming files
            rssAudioFiles.forEach(audio => {
                if (!currentFilesDictionary[audio.filename]) {
                    incomingFiles.push(audio);
                }
            });

            // Collect all files that we need to get rid of
            currentFiles.forEach(file => {
                if (file === "index.xml") {
                    return;
                }
                if (!rssAudioFilesDictionary[file]) {
                    staleFiles.push(file);
                }
            });

            // Consolidate all collections into an object
            const result = {
                inclusionList: incomingFiles,
                exclusionList: staleFiles,
                activeList: rssAudioFiles,
            }

            resolve(result);
        });
    });
}
