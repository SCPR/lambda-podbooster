'use strict';

require('dotenv').config();
const podboost = require('./podboost');

let callback = function(err, message){
    if(err){
        console.error(err);
    } else {
        console.log(message);
    }
}

podboost(callback);
