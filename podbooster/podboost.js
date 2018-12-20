'use strict';

const getPodcast    = require('./lib/get-podcast');
const uploadAudio = require('./lib/upload-audio');
const uploadXML      = require('./lib/upload-xml');

module.exports = (callback) => {
    callback = callback || function(){};
    return getPodcast()
        .then(uploadAudio)
        .then(uploadXML)
        .then(callback)
        .catch(callback);
}
