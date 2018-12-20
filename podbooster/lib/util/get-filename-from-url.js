'use strict';

module.exports = (url) => {
    var urlWithoutQueryString = url.split(/[?#]/)[0];
    var match = urlWithoutQueryString.match(/[^/]+$/g);
    return match[0];
}
