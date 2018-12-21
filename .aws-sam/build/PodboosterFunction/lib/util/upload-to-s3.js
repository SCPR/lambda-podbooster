'use strict';

const s3 = require('./s3');

module.exports = (body, filename) => {
    console.log('inside upload-to-s3');
    return new Promise(async (resolve, reject) => {
        const params = {
            Body: body,
            Bucket: process.env.S3_BUCKET,
            Key: process.env.S3_PREFIX + filename,
        }
        console.log('inside upload-to-s3 PROMISE');

        s3.upload(params, (err, data) => {
            console.log('inside upload-to-s3 s3.upload callback');
            console.log('Possible error:', err);
            console.log('Possible data:', data);
            if (err) reject(err);
            else resolve(data);
        })
        .on('httpUploadProgress', (evt) => {
            console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total)+'%');
        })
        .send((err, data) => {
            if (err) {
                console.error("Error:", err);
            } else {
                console.log("File uploaded successfully.", data);
            }
        });
    });
};
