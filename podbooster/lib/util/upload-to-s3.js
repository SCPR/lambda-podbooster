'use strict';

const s3 = require('./s3');

module.exports = (body, filename) => {
    return new Promise(async (resolve, reject) => {
        const params = {
            Body: body,
            Bucket: process.env.S3_BUCKET,
            Key: process.env.S3_PREFIX + filename,
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
