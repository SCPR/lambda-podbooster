'use strict';

const progress = require('progress-stream');
const s3 = require('./s3');

module.exports = (body, filename) => {
    return new Promise(async (resolve, reject) => {
        let params = {
            Body: body,
            Bucket: process.env.S3_BUCKET,
            Key: process.env.S3_PREFIX + filename,
        }

        if (body.pipe) {
            const progressStream = progress();
            progressStream.on('progress', () => {});
            body.pipe(progressStream);
            params.Body = progressStream;
        }

        console.log(`Processing ${filename}`)
        console.time(`${filename} finished processing in`);

        await s3.upload(params)
            .promise()
            .then((data) => {
                console.timeEnd(`${filename} finished processing in`);
                resolve(data);
            })
            .catch(err => {
                console.timeEnd(`${filename} finished processing in`);
                reject(err);
            });
    });
};
