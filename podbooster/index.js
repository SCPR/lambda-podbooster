'use strict';

require('dotenv').config();

const getPodcast    = require('./lib/get-podcast');
const uploadAudio = require('./lib/upload-audio');
const uploadXML      = require('./lib/upload-xml');

exports.handler = (event, context, callback) => {
    // Stops executing when the callback is fired.
    context.callbackWaitsForEmptyEventLoop = false;

    // Write to stdout to keep the event loop occupied.
    setTimeout(() => {
        console.log('.');
    }, 900000);

    getPodcast()
        .then(uploadAudio)
        .then(uploadXML)
        .then(() => {
            const response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: "Finished successfully." })
            }

            callback(null, response);
        })
        .catch((err) => {
            callback(err);
        });
};