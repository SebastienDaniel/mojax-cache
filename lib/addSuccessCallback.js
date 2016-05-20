/**
 * @private
 * @alias addSuccessCallback
 * @summary Adds a callback that updates cache data for the given query on success
 * @param {object} config - request parameters
 * @param {Dictionary} cache - internal cache
 */
module.exports = function addSuccessCallback(config, cache) {
    "use strict";

    /**
     * @private
     * @summary callback triggered on success which adds the
     * request url, data and timestamp to mojax-cache internal cache
     * @param {string|object} resp - parsed response body
     */
    function successCallback(resp) {
        cache.set(config.url, {
            data: resp,
            date: new Date(Date.now()).toUTCString()
        });
    }

    if (config.onSuccess) {
        if (Array.isArray(config.onSuccess)) {
            config.onSuccess.push(successCallback);
        } else {
            config.onSuccess = [config.onSuccess, successCallback];
        }
    } else {
        config.onSuccess = successCallback;
    }
};
