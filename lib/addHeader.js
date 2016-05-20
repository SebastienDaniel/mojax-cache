/**
 * @private
 * @alias addIfModifiedSinceHeader
 * @param {object} config - request parameters
 * @param {Dictionary} cache - internal cache
 * @returns {object} request configuration object
 */
module.exports = function addIfModifiedSinceHeader(config, cache) {
    "use strict";
    var date = cache.get(config.url) ? cache.get(config.url).date : new Date(Date.now()).toUTCString();

    if (config.headers) {
        if (config.headers["If-Modified-Since"] === undefined) {
            config.headers["If-Modified-Since"] = date;
        }
    } else {
        config.headers = {
            "If-Modified-Since": date
        };
    }

    return config;
};
