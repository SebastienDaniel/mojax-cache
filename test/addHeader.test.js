var expect = require("chai").expect,
    mockCache = require("sebastiendaniel-adt/dictionary")(),
    ah = require("../lib/addHeader");

describe("addHeader()", function() {
    "use strict";
    it("should inject the 'If-Modified-Since' header, into the config's headers", function() {
        var config = {
            url: "someUrl",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        };

        expect(ah(config, mockCache).headers).to.be.instanceof(Object);
        expect(ah(config, mockCache).headers).to.be.equal(config.headers);
        expect(ah(config, mockCache).headers).to.have.property("If-Modified-Since", new Date(Date.now()).toUTCString());
        expect(ah(config, mockCache).headers).to.have.property("Content-Type", "application/json");
    });

    it("should create the headers property if not present in config", function() {
        var config = {
            url: "someUrl",
            method: "GET"
        };

        expect(ah(config, mockCache).headers).to.be.instanceof(Object);
        expect(ah(config, mockCache).headers).to.have.property("If-Modified-Since", new Date(Date.now()).toUTCString());
    });

    it("should not overwrite an existing 'If-Modified-Since' header", function() {
        var config = {
            url: "someUrl",
            method: "GET",
            headers: {
                "If-Modified-Since": new Date("2016-01-01T12:30:00Z").toUTCString()
            }
        };

        expect(ah(config, mockCache).headers).to.be.instanceof(Object);
        expect(ah(config, mockCache).headers).to.be.equal(config.headers);
        expect(ah(config, mockCache).headers).to.have.property("If-Modified-Since", new Date("2016-01-01T12:30:00Z").toUTCString());
    });
});
