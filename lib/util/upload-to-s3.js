'use strict';

const s3 = require('./s3');

module.exports = (body, filename) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: process.env.S3_PREFIX + filename,
            Body: body,
        }

        s3.upload(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};
