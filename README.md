# Getting started
Add **mojax** and **mojax-cache** to your project:
`npm install mojax mojax-cache --save`

Require the two modules into your code, and create your mojax request instance:
```js
var mojax = require("mojax")(),
    cache = require("mojax-cache");

mojax.use(cache());
```

## How mojax uses middleware
Middleware are used to manipulate the request parameters **before** the actual HTTP request is started.

When you add middleware to a mojax instance, the middleware function gets added to an internal queue.
Every time you make a request, the request parameters you have provided are piped through each middleware.
Each middleware **must return the request parameters object** for the next middleware to be called. Not returning the request parameters object
(i.e. returning `null` or `undefined`) is how you can cancel a request.

The mojax request method respects the following flow:

1. make a request: `req(params);`
2. your request parameters are *piped* through each middleware
3. the middleware transform your request parameters
4. the final (*transformed*) request parameters are used to send the HTTP request
5. the HTTP request triggers callbacks, based on its progress

### How mojax-cache works
Mojax-cache is a factory, when ever you call mojax cache you're creating a new `cacheController`, which is the middleware function you want to add to mojax. That's all you need to do.

#### inner workings
mojax-cache works by caching your successful GET requests by URL. The timestamp and body of each successful GET is cached.

When a new GET request is made, mojax-cache verifies if it has made the request before, if so it adds the `If-Modified-Since` header, wraps all onSuccess callbacks and adds a callback of it's own. From there, two things can happen:

- **server responds with 200**: mojax-cache's callback will cache the successful request
- **server responds with 304**: mojax-cache fetches the response data from its internal cache, and provides that to the onSuccess callbacks.

--------
## Modules

<dl>
<dt><a href="#module_mojax-cache">mojax-cache</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#exp_module_mojax-cache--module.exports">module.exports()</a> ⇒ <code>function</code> ⏏</dt>
<dd></dd>
<dt><a href="#cacheController">cacheController()</a> ⇒ <code>object</code></dt>
<dd></dd>
</dl>

<a name="module_mojax-cache"></a>

## mojax-cache
<a name="exp_module_mojax-cache--module.exports"></a>

### module.exports() ⇒ <code>function</code> ⏏
**Kind**: global method of <code>[mojax-cache](#module_mojax-cache)</code>  
**Summary**: creates a cacheController middleware instance  
**Returns**: <code>function</code> - cacheController middleware function  
<a name="cacheController"></a>

## cacheController() ⇒ <code>object</code>
**Kind**: global function  
**Summary**: tracks all successful HTTP GET requests and caches their body response with a timestamp.
Once a URL has been cached, if it is re-requested, the controller adds the "If-Modified-Since" header to the request params.
If the server responds with a 304, the controller returns the cached data to the callbacks, allowing each callback to work unknowing of the
304 event.  
**Access:** public  
**Params**: <code>object</code> config - request configuration object  
