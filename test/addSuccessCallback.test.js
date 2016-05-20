var expect = require("chai").expect,
    Dictionary = require("sebastiendaniel-adt/dictionary"),
    add = require("../lib/addSuccessCallback");

describe("addSuccessCallback()", function() {
    "use strict";
    it("should add a callback to the onSuccess config object prop, if none is present", function() {
        var config = {};

        expect(config.onSuccess).to.not.exist;

        add(config, {});
        expect(config.onSuccess).to.exist;
        expect(config.onSuccess).to.be.instanceof(Function);
    });

    it("should add a callback to an array of onSuccess callbacks", function() {
        var config = {
            onSuccess: [function(){}]
        };

        expect(config.onSuccess).to.exist;
        expect(config.onSuccess).to.have.length(1);
        expect(config.onSuccess).to.be.instanceof(Array);
        config.onSuccess.forEach(function(cb) {
            expect(cb).to.be.instanceof(Function);
        });

        add(config, {});
        expect(config.onSuccess).to.exist;
        expect(config.onSuccess).to.have.length(2);
        expect(config.onSuccess).to.be.instanceof(Array);
        config.onSuccess.forEach(function(cb) {
            expect(cb).to.be.instanceof(Function);
        });
    });

    it("should turn an existing callback, into an array of callbacks with the added callback", function() {
        var config = {
            onSuccess: function(){}
        };

        expect(config.onSuccess).to.exist;
        expect(config.onSuccess).to.be.instanceof(Function);

        add(config, {});
        expect(config.onSuccess).to.exist;
        expect(config.onSuccess).to.have.length(2);
        expect(config.onSuccess).to.be.instanceof(Array);
        config.onSuccess.forEach(function(cb) {
            expect(cb).to.be.instanceof(Function);
        });
    });

    it("the success callback should add an entry to cache, with current time", function() {
        var config = {
                url: "someUrl"
            },
            cache = new Dictionary();
        add(config, cache);

        expect(config.onSuccess).to.be.instanceof(Function);
        expect(cache.get("someUrl")).to.be.undefined;

        config.onSuccess('{"some":"data"}');
        expect(cache.get("someUrl").date).to.eql(new Date(Date.now()).toUTCString());
        expect(cache.get("someUrl").data).to.eql('{"some":"data"}');
    });

    it("the success callback should update an existing entry in cache, with current time", function() {
        var config = {
                url: "someUrl"
            },
            cache = new Dictionary();
        add(config, cache);

        expect(config.onSuccess).to.be.instanceof(Function);
        expect(cache.get("someUrl")).to.be.undefined;

        config.onSuccess('{"some":"data"}');
        expect(cache.get("someUrl").date).to.eql(new Date(Date.now()).toUTCString());
        expect(cache.get("someUrl").data).to.eql('{"some":"data"}');

        config.onSuccess('{"some":"data2"}');
        expect(cache.get("someUrl").date).to.eql(new Date(Date.now()).toUTCString());
        expect(cache.get("someUrl").data).to.eql('{"some":"data2"}');
    });
});
