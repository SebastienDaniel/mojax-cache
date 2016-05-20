/**
 * @private
 * @summary wraps a function with the successWrapper function,
 * which provides its callback with server response data or cached data
 * based on server response status
 * @param {function} cb - function to wrap
 * @param {object} config - request parameters
 * @param {Dictionary} cache - internal cache
 * @returns {function}
 */
function wrap(cb, config, cache) {
    "use strict";

    /**
     * @alias successWrapper
     * @private
     * @summary wraps existing onSuccess callbacks, to provide them with
     * the server response body (if status = 200), or the cached data (if status = 304)
     */
    return function successWrapper(resp, xhr) {
        if (xhr.status === 304) {
            // get cached data
            cb(cache.get(config.url), xhr);
        } else {
            cb(resp, xhr);
        }
    };
}

/**
 * @alias wrapSuccessCallbacks
 * @function
 * @private
 * @summary wraps all existing onSuccess callbacks to provide response data OR cached data
 * if the server responds with 304 (no body)
 * @param {object} config - request parameters
 * @param {Dictionary} cache - internal cache
 */
module.exports = function wrapSuccessCallbacks(config, cache) {
    "use strict";
    if (config.onSuccess) {
        if (Array.isArray(config.onSuccess)) {
            config.onSuccess = config.onSuccess.map(function(cb) {
                return wrap(cb, config, cache);
            });
        } else if (typeof config.onSuccess === "function") {
            config.onSuccess = wrap(config.onSuccess, config, cache);
        }
    }
};
