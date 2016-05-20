var Dictionary = require("sebastiendaniel-adt/dictionary"),
    wrapSuccessCallbacks = require("./wrapSuccessCallbacks"),
    addSuccessCallback = require("./addSuccessCallback"),
    addHeader = require("./addHeader");

/**
 * @alias module:"mojax-cache"
 * @function
 * @summary creates a cacheController middleware instance
 *
 * @returns {function} cacheController middleware function
 */
module.exports = function cacheControllerFactory() {
    "use strict";
    var cache = new Dictionary();

    /**
     * @public
     * @name cacheController
     * @function
     *
     * @summary tracks all successful HTTP GET requests and caches their body response with a timestamp.
     * Once a URL has been cached, if it is re-requested, the controller adds the "If-Modified-Since" header to the request params.
     * If the server responds with a 304, the controller returns the cached data to the callbacks, allowing each callback to work unknowing of the
     * 304 event.
     *
     * @params {object} config - request configuration object
     * @returns {object}
     */
    return function cacheController(config) {
        // only handle GET requests
        if (config.method === "GET") {
            // url has been queried before
            if (cache.hasKey(config.url)) {
                addHeader(config, cache);
                wrapSuccessCallbacks(config, cache);
            }

            // always add the onSuccess callback to update cache
            addSuccessCallback(config, cache);
        }

        return config;
    };
};
