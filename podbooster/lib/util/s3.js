'use strict';

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    region: process.env.REGION || process.env.AWS_REGION,
    secretAccessKey: process.env.SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = s3;