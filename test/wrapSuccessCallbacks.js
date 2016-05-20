var expect = require("chai").expect,
    Dictionary = require("sebastiendaniel-adt/dictionary"),
    wc = require("../lib/wrapSuccessCallbacks");

describe("wrapSuccessCallbacks()", function() {
    "use strict";
    var mockXhr = {
            status: 200,
            response: "hi mom, it's me!"
        },
        cache = new Dictionary();

    it("should wrap existing callback with new function", function() {
        var counter = 0,
            onSuccess = function() {
                counter++;
            },
            params = {
                url: "someUrl",
                method: "GET",
                onSuccess: onSuccess
            };

        // should wrap function
        wc(params, cache);
        expect(params.onSuccess).to.be.instanceof(Function);
        expect(params.onSuccess).to.not.equal(onSuccess);
    });

    it("should wrap existing callbacks (array of functions) with new function", function() {
        var counter = 0,
            onSuccess1 = function() {
                counter++;
            },
            onSuccess2 = function() {
                counter++;
            },
            params = {
                url: "someUrl",
                method: "GET",
                onSuccess: [onSuccess1, onSuccess2]
            };

        // should wrap function
        wc(params, cache);
        expect(params.onSuccess).to.be.instanceof(Array);
        expect(params.onSuccess).to.have.length(2);

        expect(params.onSuccess).to.not.equal(onSuccess1);
        expect(params.onSuccess).to.not.equal(onSuccess2);

        expect(params.onSuccess[0]).to.not.equal(onSuccess1);
        expect(params.onSuccess[0]).to.not.equal(onSuccess2);

        expect(params.onSuccess[1]).to.not.equal(onSuccess1);
        expect(params.onSuccess[1]).to.not.equal(onSuccess2);

        expect(counter).to.eql(0);
        params.onSuccess[0]("some data", mockXhr);
        expect(counter).to.eql(1);
        params.onSuccess[1]("some data", mockXhr);
        expect(counter).to.eql(2);
    });

    it("the wrapper function should call the contained function with response data", function() {
        var counter = 0,
            onSuccess = function() {
                counter++;
            },
            params = {
                url: "someUrl",
                method: "GET",
                onSuccess: onSuccess
            };

        wc(params, cache);
        expect(counter).to.eql(0);
        params.onSuccess("some data", mockXhr);
        expect(counter).to.eql(1);
    });

    it("the wrapper function should call the contained function with cached data, when server responds with 304", function(){
        var counter = 0,
            onSuccess = function(resp) {
                counter = resp;
            },
            params = {
                url: "someUrl",
                method: "GET",
                onSuccess: onSuccess
            };

        mockXhr.status = 304;
        cache.set(params.url, "cached data");

        // should use cached data
        wc(params, cache);
        expect(counter).to.eql(0);
        params.onSuccess("some data", mockXhr);
        expect(counter).to.eql("cached data");
    });
});
