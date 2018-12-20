'use strict';

const s3 = require('./s3');

module.exports = (files) => {
    return new Promise((resolve, reject) => {
        // Prepare the audio prefix
        const prefix = process.env.S3_PREFIX + 'audio/';
        const objects = files.map((file) => {
            return { Key: prefix + file }
        });
        const params = {
            Bucket: process.env.S3_BUCKET,
            Delete: {
                Objects: objects,
            }
        };

        s3.deleteObjects(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
