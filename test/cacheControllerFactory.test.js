var expect = require("chai").expect,
    cache = require("../lib/cacheControllerFactory");

describe("cacheControllerFactory()", function() {
    var m = cache();
    it("should create a cacheController middleware function", function() {
        expect(m).to.be.instanceof(Function);
    });

    it("it should not modify the request object if it is not a GET request", function() {
        var conf = {
            url: "someUrl"
        };

        conf.method = "PUT";
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.undefined;
        expect(conf.onSuccess).to.be.undefined;

        conf.method = "POST";
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.undefined;
        expect(conf.onSuccess).to.be.undefined;

        conf.method = "DELETE";
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.undefined;
        expect(conf.onSuccess).to.be.undefined;
    });

    it("should not modify request headers if the request is not cached", function() {
        var conf = {
            url: "someUrl"
        };

        conf.method = "GET";
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.undefined;
        expect(conf.onSuccess).to.be.instanceof(Function);
    });

    it("should add If-Modified-Since header if request has been cached", function() {
        var conf = {
            url: "someUrl"
        };

        conf.method = "GET";
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.undefined;
        expect(conf.onSuccess).to.be.instanceof(Function);

        conf.onSuccess("some data from original request", {
            status: 200
        });

        conf = {
            url: "someUrl",
            method: "GET"
        };
        expect(m(conf)).to.equal(conf);
        expect(conf.headers).to.be.instanceof(Object);
        expect(conf.headers["If-Modified-Since"]).to.eql(new Date(Date.now()).toUTCString());
        expect(conf.onSuccess).to.be.instanceof(Function);
    });
});
