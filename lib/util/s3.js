'use strict';

const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({ region: process.env.AWS_REGION });

module.exports = s3;