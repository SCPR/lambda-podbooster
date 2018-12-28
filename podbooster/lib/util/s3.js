'use strict';

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = s3;